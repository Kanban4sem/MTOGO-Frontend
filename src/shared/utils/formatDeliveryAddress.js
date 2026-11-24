export function formatDeliveryAddress(address, separator = ', ') {
	if (!address) return null

	const { street, postalCode, city } = address
	const postalArea = [postalCode, city].filter(Boolean).join(' ')
	return [street, postalArea].filter(Boolean).join(separator) || null
}
