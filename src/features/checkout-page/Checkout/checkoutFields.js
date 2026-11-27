import { getCountryName } from '@/shared/data/countries.js'
import { PAYMENT_TOKENS } from '@/features/checkout-page/services/orderService.js'

// No maxLength, so a longer address can be typed and gets a message instead of being cut off silently.
export function getDeliveryAddressFields(t, language) {
	return [
		{
			name: 'street',
			label: t('street'),
			autoComplete: 'street-address',
		},
		{
			name: 'postalArea',
			fields: [
				{
					name: 'postalCode',
					label: t('postalCode'),
					inputMode: 'numeric',
					autoComplete: 'postal-code',
				},
				{
					name: 'city',
					label: t('city'),
					autoComplete: 'address-level2',
				},
			],
		},
		{
			name: 'country',
			label: t('country'),
			value: getCountryName('Denmark', language),
			disabled: true,
		},
	]
}
export function getPaymentOptions(t) {
	return [
		{ token: PAYMENT_TOKENS.CARD, label: t('simulatedCard') },
		{
			token: PAYMENT_TOKENS.SIMULATED_DECLINE,
			label: t('simulateDecline'),
		},
	]
}

export function getCardFields(t) {
	return [
		{
			name: 'cardNumber',
			label: t('cardNumber'),
			placeholder: '1234 5678 9012 3456',
			disabled: true,
		},
		{
			name: 'cardDetails',
			fields: [
				{
					name: 'expiryDate',
					label: t('expiryDate'),
					placeholder: t('expiryPlaceholder'),
					disabled: true,
				},
				{
					name: 'cvc',
					label: 'CVC',
					placeholder: '123',
					disabled: true,
				},
			],
		},
	]
}
