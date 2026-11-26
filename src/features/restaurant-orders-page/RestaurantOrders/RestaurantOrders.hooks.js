import { useState } from 'react'
import {
	useNotification,
	useRequestErrorNotification,
} from '@/shared/hooks/useNotification.js'
import { useRequest } from '@/shared/hooks/useRequest.js'
import {
	getRestaurantOrders,
	updateRestaurantOrderStatus,
} from '@/features/restaurant-orders-page/services/restaurantOrderService.js'

export function useRestaurantOrders() {
	const {
		data: orders,
		isLoading,
		error,
		reload,
		updateData,
	} = useRequest(getRestaurantOrders)
	useRequestErrorNotification(
		error,
		error && `Vi kunne ikke hente ordrerne. ${error.message}`,
	)
	const [pendingOrderId, setPendingOrderId] = useState(null)
	const notify = useNotification()

	async function changeStatus(orderId, status) {
		setPendingOrderId(orderId)
		try {
			const order = await updateRestaurantOrderStatus(orderId, status)
			updateData((currentOrders) =>
				currentOrders.map((current) =>
					current.id === order.id ? order : current,
				),
			)
			notify(
				`Ordre nr. ${order.id} · ${order.statusName.danish}`,
				'success',
			)
		} catch (error) {
			if (error.status === 404 || error.status === 409) {
				reload()
				notify(
					'Ordren kan have ændret sig. Listen opdateres.',
					'warning',
				)
			} else if (error.status !== 401) {
				notify(error.message, 'error')
			}
		} finally {
			setPendingOrderId(null)
		}
	}

	return {
		orders,
		isLoading,
		error,
		pendingOrderId,
		changeStatus,
		refreshOrders: reload,
	}
}
