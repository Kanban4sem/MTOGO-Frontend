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

export function getRestaurantOrders(signal) {
	return client('/restaurant/orders', { signal, cache: 'no-store' })
}

export function patchRestaurantOrder(orderId, status) {
	return client(`/restaurant/orders/${encodeURIComponent(orderId)}`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
	})
}

export function getDeliveryAgentOrders(signal) {
	return client('/delivery-agent/orders', { signal, cache: 'no-store' })
}

export function patchDeliveryAgentOrder(orderId, action) {
	return client(`/delivery-agent/orders/${encodeURIComponent(orderId)}`, {
		method: 'PATCH',
		body: JSON.stringify({ action }),
	})
}
