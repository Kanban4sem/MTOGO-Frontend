import { client } from '@/api/client.js'

export function placeOrder(order) {
	return client('/orders', {
		method: 'POST',
		body: JSON.stringify(order),
	})
}
