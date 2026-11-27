import { useLanguage } from '@/shared/i18n/useLanguage.js'
import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/customer-settings-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useCallback, useEffect, useRef } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'
import Button from '@/shared/components/Button/Button.jsx'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import {
	useCustomerSettings,
	useCustomerSettingsRequest,
} from '@/features/customer-settings-page/CustomerSettings/CustomerSettings.hooks.js'
import { formatAddressError } from '@/shared/utils/validateDeliveryAddress.js'
import { useRequestErrorNotification } from '@/shared/hooks/useNotification.js'
import styles from '@/features/customer-settings-page/CustomerSettings/CustomerSettings.module.css'

const CONTACT_FIELDS = [
	{
		name: 'firstName',
		labelKey: 'firstName',
		autoComplete: 'given-name',
		maxLength: 100,
	},
	{
		name: 'lastName',
		labelKey: 'lastName',
		autoComplete: 'family-name',
		maxLength: 100,
	},
	{
		name: 'phoneNumber',
		labelKey: 'phoneNumber',
		type: 'tel',
		autoComplete: 'tel',
		maxLength: 30,
	},
]

const ADDRESS_FIELDS = [
	{
		name: 'street',
		labelKey: 'street',
		autoComplete: 'street-address',
	},
	{
		name: 'postalCode',
		labelKey: 'postalCode',
		autoComplete: 'postal-code',
		inputMode: 'numeric',
	},
	{ name: 'city', labelKey: 'city', autoComplete: 'address-level2' },
]

function LeaveSettingsDialog({ blocker, isSaving }) {
	const t = useTranslations(messages)
	const dialogRef = useRef(null)
	const isBlocked = blocker.state === 'blocked'

	useEffect(() => {
		const dialog = dialogRef.current
		if (isBlocked && !dialog.open) dialog.showModal()
		if (!isBlocked && dialog.open) dialog.close()
	}, [isBlocked])

	function stay(event) {
		event.preventDefault()
		blocker.reset()
	}

	return (
		<dialog
			ref={dialogRef}
			className={styles.dialog}
			aria-labelledby="leave-settings-title"
			onCancel={stay}
		>
			<h2 id="leave-settings-title">{t('discardChanges')}</h2>
			<p>{isSaving ? t('savingChanges') : t('unsavedChanges')}</p>
			<div className={styles.dialogActions}>
				<Button variant="secondary" label={t('stay')} onClick={stay} />
				<Button
					label={t('discardAndLeave')}
					onClick={blocker.proceed}
					disabled={isSaving}
				/>
			</div>
		</dialog>
	)
}

function AddressEditor({ row, index, errors, onEdit, onToggleRemoval }) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	return (
		<fieldset className={styles.section}>
			<legend>
				{row.saved
					? t('addressNumber', { number: index + 1 })
					: t('newAddress')}
				{row.saved?.isDefault && t('defaultAddress')}
			</legend>
			{row.removed ? (
				<p>{t('pendingAddressRemoval')}</p>
			) : (
				<div className={`${styles.fields} ${styles.address}`}>
					<FormFields
						fields={ADDRESS_FIELDS.map(
							({ labelKey, ...field }) => ({
								...field,
								label: t(labelKey),
								placeholder: row.saved?.[field.name],
								value: row.draft[field.name] ?? '',
								error: formatAddressError(
									errors?.[field.name],
									language,
								),
								onChange: (event) => onEdit(row.key, event),
							}),
						)}
					/>
				</div>
			)}
			<div className={styles.addressActions}>
				<Button
					size="s"
					variant="secondary"
					label={row.removed ? t('undo') : t('removeAddress')}
					onClick={() => onToggleRemoval(row)}
				/>
			</div>
		</fieldset>
	)
}

function CustomerSettingsForm({ user, initialAddresses }) {
	const t = useTranslations(messages)
	const {
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
	} = useCustomerSettings(user, initialAddresses)
	const shouldBlock = hasChanges || isSaving
	const blocker = useBlocker(
		({ currentLocation, nextLocation }) =>
			shouldBlock && currentLocation.pathname !== nextLocation.pathname,
	)
	useBeforeUnload(
		useCallback(
			(event) => {
				if (shouldBlock) {
					event.preventDefault()
					event.returnValue = true
				}
			},
			[shouldBlock],
		),
	)

	const contactFields = CONTACT_FIELDS.map(({ labelKey, ...field }) => ({
		...field,
		label: t(labelKey),
		placeholder: profile?.[field.name] ?? undefined,
		value:
			field.name === 'phoneNumber' && clearPhone
				? ''
				: (contactDraft[field.name] ?? ''),
		disabled: field.name === 'phoneNumber' && clearPhone,
		onChange: editContact,
	}))
	contactFields.push({
		name: 'email',
		labelKey: 'emailAddress',
		type: 'email',
		value: user.email ?? '',
		readOnly: true,
	})

	return (
		<>
			<form
				className={styles.form}
				onSubmit={saveSettings}
				aria-busy={isSaving}
			>
				<div className={styles.heading}>
					<h1>{t('settings')}</h1>
					<Button
						type="submit"
						label={isSaving ? t('saving') : t('update')}
						disabled={!hasChanges || isSaving}
					/>
				</div>
				<p className={styles.description}>
					{t('settingsInstructions')}
				</p>
				<fieldset className={styles.section} disabled={isSaving}>
					<legend>{t('contactDetails')}</legend>
					<div className={styles.fields}>
						<FormFields fields={contactFields} />
					</div>
					{profile?.phoneNumber && (
						<label className={styles.clearPhone}>
							<input
								type="checkbox"
								checked={clearPhone}
								onChange={(event) =>
									setClearPhone(event.target.checked)
								}
							/>
							{t('removePhone')}
						</label>
					)}
				</fieldset>
				<fieldset className={styles.addressList} disabled={isSaving}>
					<legend>{t('deliveryAddresses')}</legend>
					{addresses.length === 0 && <p>{t('noSavedAddresses')}</p>}
					{addresses.map((row, index) => (
						<AddressEditor
							key={row.key}
							row={row}
							index={index}
							errors={addressErrors[row.key]}
							onEdit={editAddress}
							onToggleRemoval={toggleRemoval}
						/>
					))}
					<p className={styles.description}>{t('denmarkOnly')}</p>
					<Button
						variant="secondary"
						label={t('addAddress')}
						onClick={addAddress}
					/>
				</fieldset>
			</form>
			<LeaveSettingsDialog blocker={blocker} isSaving={isSaving} />
		</>
	)
}

export default function CustomerSettings() {
	const t = useTranslations(messages)
	const {
		data: settings,
		isLoading,
		error,
		reload,
	} = useCustomerSettingsRequest()
	useRequestErrorNotification(error, (language) =>
		translate(messages, language, 'settingsFailed', {
			message: getRequestErrorMessage(error, language),
		}),
	)

	if (isLoading) {
		return (
			<div className={styles.request}>
				<RequestState title={t('loadingSettings')} isLoading />
			</div>
		)
	}
	if (error) {
		return (
			<div className={styles.request}>
				<RequestState title={t('settings')} headingLevel="h1">
					<Button label={t('retry')} onClick={reload} />
				</RequestState>
			</div>
		)
	}

	return (
		<CustomerSettingsForm
			user={settings.user}
			initialAddresses={settings.addresses}
		/>
	)
}
