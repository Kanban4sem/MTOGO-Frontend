import { useLanguage } from '@/shared/i18n/useLanguage.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/checkout-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRequestMessage } from '@/shared/utils/requestErrors.js'
import { getOrderConfirmationPath } from '@/shared/data/paths.js'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { useMaintenance } from '@/shared/hooks/useMaintenance.js'
import {
	useNotification,
	useRequestErrorNotification,
} from '@/shared/hooks/useNotification.js'
import { useRequest } from '@/shared/hooks/useRequest.js'
import { listSavedDeliveryAddresses } from '@/shared/services/deliveryAddressService.js'
import { getSignedInUser } from '@/shared/services/userService.js'
import { withErrorReference } from '@/shared/utils/errorReference.js'
import {
	formatAddressError,
	formatAddressErrors,
	validateDeliveryAddress,
} from '@/shared/utils/validateDeliveryAddress.js'
import {
	PAYMENT_TOKENS,
	placeOrderFromBasket,
} from '@/features/checkout-page/services/orderService.js'
import { getDeliveryAddressFields } from '@/features/checkout-page/Checkout/checkoutFields.js'

// Every failure keeps the basket, since it is only emptied after the order is placed.
// The client handles 401: it clears the session, and ProtectedRoute sends the user to login.
// A 403 here can only mean the account is not a customer, so checkout says so instead of the client's general message.
function getCheckoutErrorMessage(error, language) {
	const basketKept = translate(messages, language, 'basketKept')
	switch (error.status) {
		case 403:
			return translate(messages, language, 'customerOnlyError', {
				basketKept,
			})
		case 402:
			return translate(messages, language, 'paymentDeclined', {
				basketKept,
			})
		case 404:
			return translate(messages, language, 'orderingUnavailable', {
				basketKept,
			})
		case 409:
			return translate(messages, language, 'basketItemsUnavailable', {
				basketKept,
			})
		default:
			// The reference goes last, so it doesn't split the general message from the basket notice.
			// A network failure has no status and keeps the client's connection message.
			return withErrorReference(
				getRequestMessage(error, language) + ' ' + basketKept,
				error,
				language,
			)
	}
}

function withFieldState(fields, fieldErrors, addressDefaults, language) {
	return fields.map((field) =>
		field.fields
			? {
					...field,
					fields: withFieldState(
						field.fields,
						fieldErrors,
						addressDefaults,
						language,
					),
				}
			: {
					...field,
					error: formatAddressError(
						fieldErrors[field.name],
						language,
					),
					...(field.value === undefined && {
						defaultValue: addressDefaults?.[field.name],
					}),
				},
	)
}

async function loadAddresses(signal) {
	const [user, addresses] = await Promise.allSettled([
		getSignedInUser(signal),
		listSavedDeliveryAddresses(signal),
	])
	return {
		profile: user.value?.profile,
		savedAddresses: addresses.value ?? [],
		addressError: addresses.reason,
	}
}

export function useCheckout() {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const navigate = useNavigate()
	const notify = useNotification()
	const { pauses, recordPause } = useMaintenance()
	const isOrderingPaused = pauses[MAINTENANCE_FEATURES.ORDERING] === true
	const { basket, emptyBasket } = useBasket()
	const [fieldErrors, setFieldErrors] = useState({})
	const {
		data: addressRequest,
		isLoading: isAddressLoading,
		updateData: updateAddresses,
	} = useRequest(loadAddresses)
	const [addressChoice, setAddressChoice] = useState(null)
	const [paymentToken, setPaymentToken] = useState(PAYMENT_TOKENS.CARD)
	const [showMenuLink, setShowMenuLink] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	// State only updates on the next render, so a second submit in the same tick needs the ref to be stopped.
	const isSubmittingRef = useRef(false)
	const savedAddresses = addressRequest?.savedAddresses ?? []
	const defaultAddress = savedAddresses.find((address) => address.isDefault)
	const selectedAddress =
		addressChoice === null
			? defaultAddress
			: savedAddresses.find(
					(address) => String(address.id) === addressChoice,
				)
	const addressError = addressRequest?.addressError
	useRequestErrorNotification(addressError, (language) =>
		withErrorReference(
			translate(messages, language, 'savedAddressesFailed'),
			addressError,
			language,
		),
	)
	const profileAddress = addressRequest?.profile?.address
	const addressDefaults =
		addressError || !profileAddress?.street ? profileAddress : null

	async function submitOrder(event) {
		event.preventDefault()
		if (isSubmittingRef.current || isAddressLoading || isOrderingPaused)
			return
		setShowMenuLink(false)
		let addressSelection = { deliveryAddressId: selectedAddress?.id }
		if (!selectedAddress) {
			const form = event.currentTarget
			const formData = new FormData(form)
			const deliveryAddress = {
				street: formData.get('street').trim(),
				postalCode: formData.get('postalCode').trim(),
				city: formData.get('city').trim(),
			}
			const errors = validateDeliveryAddress(deliveryAddress)
			setFieldErrors(errors)
			const firstInvalidField = Object.keys(errors)[0]
			if (firstInvalidField) {
				form.elements.namedItem(firstInvalidField)?.focus()
				notify(
					(language) => formatAddressErrors(errors, language),
					'warning',
				)
				return
			}
			addressSelection = {
				deliveryAddress,
				useDefaultAddress: false,
				saveAsDefault: formData.has('saveAsDefault'),
			}
		}

		isSubmittingRef.current = true
		setIsSubmitting(true)
		try {
			const order = await placeOrderFromBasket(
				basket,
				addressSelection,
				paymentToken,
			)
			notify(
				(language) => translate(messages, language, 'orderSent'),
				'success',
			)
			navigate(getOrderConfirmationPath(order.id))
			emptyBasket()
		} catch (error) {
			isSubmittingRef.current = false
			setIsSubmitting(false)
			if (recordPause(error)) return
			if (error.status === 404 && selectedAddress) {
				updateAddresses((previous) => ({
					...previous,
					savedAddresses: previous.savedAddresses.filter(
						(address) => address.id !== selectedAddress.id,
					),
				}))
				setAddressChoice('')
				notify(
					(language) =>
						translate(messages, language, 'savedAddressRemoved', {
							basketKept: translate(
								messages,
								language,
								'basketKept',
							),
						}),
					'warning',
				)
			} else if (error.status !== 401) {
				setShowMenuLink(error.status === 409)
				notify(
					(language) => getCheckoutErrorMessage(error, language),
					'error',
				)
			}
		}
	}

	return {
		savedAddresses,
		selectedAddress,
		setAddressChoice,
		profile: addressRequest?.profile,
		isAddressLoading,
		deliveryAddressFields: withFieldState(
			getDeliveryAddressFields(t, language),
			fieldErrors,
			addressDefaults,
			language,
		),
		paymentToken,
		setPaymentToken,
		isOrderingPaused,
		showMenuLink,
		isSubmitting,
		submitOrder,
	}
}
