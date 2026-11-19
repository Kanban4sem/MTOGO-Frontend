// The backend sends English country names and leaves the Danish names to the frontend.
export const COUNTRY_NAMES = {
	Denmark: 'Danmark',
}

export function getCountryName(country) {
	return COUNTRY_NAMES[country] ?? country
}
