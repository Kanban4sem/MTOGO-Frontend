import { useEffect, useState } from 'react'
import { readCustomerOrders } from '@/features/customer-orders-page/services/customerOrderService.js'

export function useCustomerOrders(orderId) {
	const [request, setRequest] = useState({ isLoading: true })

	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller

		async function loadOrders() {
			try {
				const orders = await readCustomerOrders(orderId, signal)
				if (!signal.aborted) setRequest({ orders })
			} catch (error) {
				if (!signal.aborted) setRequest({ error })
			}
		}

		void loadOrders()
		return () => controller.abort()
	}, [orderId])

	return request
}
