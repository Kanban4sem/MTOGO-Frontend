import { client } from '@/api/client.js'

export function placeOrder(order) {
	return client('/orders', {
		method: 'POST',
		body: JSON.stringify(order),
	})
}

export function getCustomerOrders(signal) {
	return client('/customer/orders', { signal, cache: 'no-store' })
}

export function getCustomerOrder(orderId, signal) {
	return client(`/customer/orders/${encodeURIComponent(orderId)}`, {
		signal,
		cache: 'no-store',
	})
}
