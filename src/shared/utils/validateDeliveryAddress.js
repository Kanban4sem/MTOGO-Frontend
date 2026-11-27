import { translate } from '@/shared/i18n/translate.js'
import messages from '@/shared/utils/validateDeliveryAddress.messages.json'

const MAX_TEXT_LENGTH = 100

export function validateDeliveryAddress({ street, postalCode, city }) {
	const errors = {}
	if (!street) errors.street = 'missingStreet'
	else if (street.length > MAX_TEXT_LENGTH) errors.street = 'streetTooLong'
	if (!/^\d{4}$/.test(postalCode)) errors.postalCode = 'invalidPostalCode'
	if (!city) errors.city = 'missingCity'
	else if (city.length > MAX_TEXT_LENGTH) errors.city = 'cityTooLong'
	return errors
}

export function formatAddressError(key, language) {
	return (
		key &&
		translate(messages, language, key, { maxLength: MAX_TEXT_LENGTH })
	)
}

export function formatAddressErrors(errors, language) {
	return Object.values(errors)
		.map((key) => formatAddressError(key, language))
		.join(' ')
}
