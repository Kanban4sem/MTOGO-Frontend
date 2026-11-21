import { getCustomerOrder, getCustomerOrders } from '@/api/endpoints/orders.js'

export function readCustomerOrders(orderId, signal) {
	return orderId === undefined
		? getCustomerOrders(signal)
		: getCustomerOrder(orderId, signal)
}
