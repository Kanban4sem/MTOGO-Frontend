import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/customer-settings-page/messages.json'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useNotification } from '@/shared/hooks/useNotification.js'
import { useRequest } from '@/shared/hooks/useRequest.js'
import {
	listSavedDeliveryAddresses,
	removeDeliveryAddress,
	storeDeliveryAddress,
} from '@/shared/services/deliveryAddressService.js'
import { getSignedInUser } from '@/shared/services/userService.js'
import {
	formatAddressErrors,
	validateDeliveryAddress,
} from '@/shared/utils/validateDeliveryAddress.js'

const ADDRESS_NAMES = ['street', 'postalCode', 'city']

function addressFields({ saved, draft }) {
	return Object.fromEntries(
		ADDRESS_NAMES.map((name) => [
			name,
			draft[name]?.trim() || saved?.[name] || '',
		]),
	)
}

function hasAddressChanges(row) {
	return (
		row.removed ||
		!row.saved ||
		ADDRESS_NAMES.some((name) => {
			const value = row.draft[name]?.trim()
			return value && value !== row.saved[name]
		})
	)
}

function savedRow(address) {
	return { key: String(address.id), saved: address, draft: {} }
}

async function loadSettings(signal) {
	const [user, addresses] = await Promise.all([
		getSignedInUser(signal),
		listSavedDeliveryAddresses(signal),
	])
	return { user, addresses }
}

export function useCustomerSettingsRequest() {
	return useRequest(loadSettings)
}

export function useCustomerSettings(initialUser, initialAddresses) {
	const { updateProfile } = useAuth()
	const [profile, setProfile] = useState(initialUser.profile)
	const [contactDraft, setContactDraft] = useState({})
	const [clearPhone, setClearPhone] = useState(false)
	const [addresses, setAddresses] = useState(() =>
		initialAddresses.map(savedRow),
	)
	const [addressErrors, setAddressErrors] = useState({})
	const notify = useNotification()
	const [isSaving, setIsSaving] = useState(false)
	const nextAddressKey = useRef(0)
	const saveRequest = useRef(null)

	useEffect(() => () => saveRequest.current?.abort(), [])

	const contact = {
		firstName: contactDraft.firstName?.trim() || profile?.firstName || '',
		lastName: contactDraft.lastName?.trim() || profile?.lastName || '',
		phoneNumber: clearPhone
			? null
			: contactDraft.phoneNumber?.trim() || profile?.phoneNumber || null,
	}
	const contactChanged = Object.keys(contact).some(
		(name) =>
			contact[name] !==
			(profile?.[name] || (name === 'phoneNumber' ? null : '')),
	)
	const pendingAddresses = addresses.filter(hasAddressChanges)
	const hasChanges = contactChanged || pendingAddresses.length > 0

	function editContact(event) {
		const { name, value } = event.target
		setContactDraft((previous) => ({ ...previous, [name]: value }))
	}

	function addAddress() {
		const key = `new-${++nextAddressKey.current}`
		setAddresses((previous) => [...previous, { key, draft: {} }])
	}

	function editAddress(key, event) {
		const { name, value } = event.target
		setAddresses((previous) =>
			previous.map((row) =>
				row.key === key
					? { ...row, draft: { ...row.draft, [name]: value } }
					: row,
			),
		)
	}

	function toggleRemoval(address) {
		if (address.saved) {
			setAddresses((previous) =>
				previous.map((row) =>
					row.key === address.key
						? { ...row, removed: !row.removed }
						: row,
				),
			)
		} else {
			setAddresses((previous) =>
				previous.filter((row) => row.key !== address.key),
			)
		}
	}

	async function saveSettings(event) {
		event.preventDefault()
		if (!hasChanges || saveRequest.current) return

		const errors = {}
		for (const row of pendingAddresses) {
			if (row.removed) continue
			const fieldErrors = validateDeliveryAddress(addressFields(row))
			if (Object.keys(fieldErrors).length) errors[row.key] = fieldErrors
		}
		setAddressErrors(errors)
		if (contactChanged && (!contact.firstName || !contact.lastName)) {
			notify(
				(language) => translate(messages, language, 'fullNameRequired'),
				'warning',
			)
			return
		}
		const firstInvalidIndex = addresses.findIndex((row) => errors[row.key])
		if (firstInvalidIndex !== -1) {
			const { key, saved } = addresses[firstInvalidIndex]
			notify((language) => {
				const label = saved
					? translate(messages, language, 'addressNumber', {
							number: firstInvalidIndex + 1,
						})
					: translate(messages, language, 'newAddress')
				return label + '. ' + formatAddressErrors(errors[key], language)
			}, 'warning')
			return
		}

		const controller = new AbortController()
		const { signal } = controller
		saveRequest.current = controller
		setIsSaving(true)
		let hasSaved = false
		try {
			if (contactChanged) {
				const updatedUser = await updateProfile(contact, signal)
				if (signal.aborted) return
				setProfile(updatedUser.profile)
				setContactDraft({})
				setClearPhone(false)
				hasSaved = true
			}
			for (const row of pendingAddresses) {
				if (row.removed) {
					await removeDeliveryAddress(row.saved.id, signal)
					if (signal.aborted) return
					setAddresses((previous) =>
						previous.filter((address) => address.key !== row.key),
					)
				} else {
					const address = await storeDeliveryAddress(
						addressFields(row),
						row.saved?.id,
						signal,
					)
					if (signal.aborted) return
					setAddresses((previous) =>
						previous.map((entry) =>
							entry.key === row.key ? savedRow(address) : entry,
						),
					)
				}
				hasSaved = true
			}
			notify(
				(language) => translate(messages, language, 'settingsSaved'),
				'success',
			)
		} catch (error) {
			if (signal.aborted) return
			if (error.status !== 401) {
				notify((language) => {
					const savedNotice = hasSaved
						? translate(messages, language, 'settingsPartlySaved')
						: ''
					return savedNotice + getRequestErrorMessage(error, language)
				}, 'error')
			}
		} finally {
			saveRequest.current = null
			if (!signal.aborted) setIsSaving(false)
		}
	}

	return {
		profile,
		contactDraft,
		clearPhone,
		setClearPhone,
		editContact,
		addresses,
		addressErrors,
		addAddress,
		editAddress,
		toggleRemoval,
		hasChanges,
		isSaving,
		saveSettings,
	}
}
