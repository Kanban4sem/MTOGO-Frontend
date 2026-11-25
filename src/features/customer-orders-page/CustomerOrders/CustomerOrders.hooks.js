import { useCallback } from 'react'
import {
	getCustomerOrder,
	getCustomerOrders,
} from '@/shared/services/customerOrderService.js'
import { useRequest } from '@/shared/hooks/useRequest.js'

export function useCustomerOrders(orderId) {
	const loadOrders = useCallback(
		(signal) =>
			orderId === undefined
				? getCustomerOrders(signal)
				: getCustomerOrder(orderId, signal),
		[orderId],
	)
	return useRequest(loadOrders)
}
