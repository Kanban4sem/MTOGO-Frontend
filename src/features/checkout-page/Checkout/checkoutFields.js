import { COUNTRY_NAMES } from '@/shared/data/countries.js'
import { PAYMENT_TOKENS } from '@/features/checkout-page/services/orderService.js'

// No maxLength, so a longer address can be typed and gets a message instead of being cut off silently.
export const DELIVERY_ADDRESS_FIELDS = [
	{
		name: 'street',
		label: 'Vej og husnummer',
		autoComplete: 'street-address',
	},
	{
		name: 'postalArea',
		fields: [
			{
				name: 'postalCode',
				label: 'Postnummer',
				inputMode: 'numeric',
				autoComplete: 'postal-code',
			},
			{
				name: 'city',
				label: 'By',
				autoComplete: 'address-level2',
			},
		],
	},
	{
		name: 'country',
		label: 'Land',
		defaultValue: COUNTRY_NAMES.Denmark,
		disabled: true,
	},
]
export const PAYMENT_OPTIONS = [
	{ token: PAYMENT_TOKENS.CARD, label: 'Betalingskort (simuleret)' },
	{
		token: PAYMENT_TOKENS.SIMULATED_DECLINE,
		label: 'Simulér en afvist betaling',
	},
]

export const CARD_FIELDS = [
	{
		name: 'cardNumber',
		label: 'Kortnummer',
		placeholder: '1234 5678 9012 3456',
		disabled: true,
	},
	{
		name: 'cardDetails',
		fields: [
			{
				name: 'expiryDate',
				label: 'Udløbsdato',
				placeholder: 'MM/ÅÅ',
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
