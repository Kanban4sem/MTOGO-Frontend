import { useCallback } from 'react'
import { getCustomerOrder } from '@/shared/services/customerOrderService.js'
import { useRequest } from '@/shared/hooks/useRequest.js'

export function useOrderConfirmation(orderId) {
	const loadOrder = useCallback(
		(signal) => getCustomerOrder(orderId, signal),
		[orderId],
	)
	return useRequest(loadOrder)
}
