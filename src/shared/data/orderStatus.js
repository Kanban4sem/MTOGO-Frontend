// The backend sends English status codes and leaves the Danish names to the frontend.
// Every view that shows an order status reads it here, so the names don't drift.
export const ORDER_STATUS_NAMES = {
	PLACED: 'Afgivet',
	ACCEPTED: 'Accepteret',
	REJECTED: 'Afvist',
	READY: 'Klar',
	PICKED_UP: 'Afhentet',
	DELIVERED: 'Leveret',
}

export function getOrderStatusName(status) {
	return ORDER_STATUS_NAMES[status] ?? status
}
