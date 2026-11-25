const MAX_TEXT_LENGTH = 100

export function validateDeliveryAddress({ street, postalCode, city }) {
	const errors = {}
	if (!street) errors.street = 'Skriv vej og husnummer.'
	else if (street.length > MAX_TEXT_LENGTH)
		errors.street = `Vej og husnummer må højst være ${MAX_TEXT_LENGTH} tegn.`
	if (!/^\d{4}$/.test(postalCode))
		errors.postalCode = 'Postnummeret skal være præcis 4 cifre.'
	if (!city) errors.city = 'Skriv byen.'
	else if (city.length > MAX_TEXT_LENGTH)
		errors.city = `Byen må højst være ${MAX_TEXT_LENGTH} tegn.`
	return errors
}
