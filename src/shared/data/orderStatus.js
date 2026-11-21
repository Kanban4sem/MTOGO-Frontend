// Fallback for order responses that contain only a status code.
export const ORDER_STATUS_NAMES = {
	PLACED: 'Afgivet',
	ACCEPTED: 'Accepteret',
	REJECTED: 'Afvist',
	READY: 'Klar',
	PICKED_UP: 'Afhentet',
	DELIVERED: 'Leveret',
}

export function getOrderStatusName(status, statusName) {
	return statusName ?? ORDER_STATUS_NAMES[status] ?? status
}
