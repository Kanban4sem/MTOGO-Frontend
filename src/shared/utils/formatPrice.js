const formatter = new Intl.NumberFormat('da-DK', {
	style: 'currency',
	currency: 'DKK',
})

export function formatPrice(price) {
	return formatter.format(price)
}
