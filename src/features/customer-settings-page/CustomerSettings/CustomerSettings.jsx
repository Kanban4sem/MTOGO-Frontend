import { useCallback, useEffect, useRef } from 'react'
import { useBeforeUnload, useBlocker } from 'react-router-dom'
import Button from '@/shared/components/Button/Button.jsx'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import {
	useCustomerSettings,
	useCustomerSettingsRequest,
} from '@/features/customer-settings-page/CustomerSettings/CustomerSettings.hooks.js'
import styles from '@/features/customer-settings-page/CustomerSettings/CustomerSettings.module.css'

const CONTACT_FIELDS = [
	{
		name: 'firstName',
		label: 'Fornavn',
		autoComplete: 'given-name',
		maxLength: 100,
	},
	{
		name: 'lastName',
		label: 'Efternavn',
		autoComplete: 'family-name',
		maxLength: 100,
	},
	{
		name: 'phoneNumber',
		label: 'Telefonnummer',
		type: 'tel',
		autoComplete: 'tel',
		maxLength: 30,
	},
]

const ADDRESS_FIELDS = [
	{
		name: 'street',
		label: 'Vej og husnummer',
		autoComplete: 'street-address',
	},
	{
		name: 'postalCode',
		label: 'Postnummer',
		autoComplete: 'postal-code',
		inputMode: 'numeric',
	},
	{ name: 'city', label: 'By', autoComplete: 'address-level2' },
]

function LeaveSettingsDialog({ blocker, isSaving }) {
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
			<h2 id="leave-settings-title">Kassér dine ændringer?</h2>
			<p>
				{isSaving
					? 'Vi gemmer dine ændringer.'
					: 'Du har ændringer, som du kan miste.'}
			</p>
			<div className={styles.dialogActions}>
				<Button
					variant="secondary"
					label="Bliv på siden"
					onClick={stay}
				/>
				<Button
					label="Kassér og forlad"
					onClick={blocker.proceed}
					disabled={isSaving}
				/>
			</div>
		</dialog>
	)
}

function AddressEditor({ row, index, errors, onEdit, onToggleRemoval }) {
	return (
		<fieldset className={styles.section}>
			<legend>
				{row.saved ? `Adresse ${index + 1}` : 'Ny adresse'}
				{row.saved?.isDefault && ' · Standardadresse'}
			</legend>
			{row.removed ? (
				<p>Adressen fjernes, når du opdaterer.</p>
			) : (
				<div className={`${styles.fields} ${styles.address}`}>
					<FormFields
						fields={ADDRESS_FIELDS.map((field) => ({
							...field,
							placeholder: row.saved?.[field.name],
							value: row.draft[field.name] ?? '',
							error: errors?.[field.name],
							onChange: (event) => onEdit(row.key, event),
						}))}
					/>
				</div>
			)}
			<div className={styles.addressActions}>
				<Button
					size="s"
					variant="secondary"
					label={row.removed ? 'Fortryd' : 'Fjern adresse'}
					onClick={() => onToggleRemoval(row)}
				/>
			</div>
		</fieldset>
	)
}

function CustomerSettingsForm({ user, initialAddresses }) {
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
		feedback,
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

	const contactFields = CONTACT_FIELDS.map((field) => ({
		...field,
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
		label: 'E-mail',
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
					<h1>Indstillinger</h1>
					<Button
						type="submit"
						label={isSaving ? 'Gemmer…' : 'Opdatér'}
						disabled={!hasChanges || isSaving}
					/>
				</div>
				<p className={styles.description}>
					Udfyld de felter, du vil ændre, og vælg Opdatér.
				</p>
				{feedback?.error && (
					<p className={styles.error} role="alert">
						{feedback.error}
					</p>
				)}
				{feedback?.success && (
					<p className={styles.status} role="status">
						{feedback.success}
					</p>
				)}
				<fieldset className={styles.section} disabled={isSaving}>
					<legend>Kontaktoplysninger</legend>
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
							Fjern mit telefonnummer
						</label>
					)}
				</fieldset>
				<fieldset className={styles.addressList} disabled={isSaving}>
					<legend>Leveringsadresser</legend>
					{addresses.length === 0 && (
						<p>Du har ingen gemte leveringsadresser.</p>
					)}
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
					<p className={styles.description}>
						Vi leverer kun i Danmark.
					</p>
					<Button
						variant="secondary"
						label="Tilføj adresse"
						onClick={addAddress}
					/>
				</fieldset>
			</form>
			<LeaveSettingsDialog blocker={blocker} isSaving={isSaving} />
		</>
	)
}

export default function CustomerSettings() {
	const {
		data: settings,
		isLoading,
		error,
		reload,
	} = useCustomerSettingsRequest()

	if (isLoading) {
		return (
			<div className={styles.request}>
				<RequestState title="Henter indstillinger…" isLoading />
			</div>
		)
	}
	if (error) {
		return (
			<div className={styles.request}>
				<RequestState
					title="Vi kunne ikke hente dine indstillinger"
					headingLevel="h1"
					symbol=":("
				>
					<Button label="Prøv igen" onClick={reload} />
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
