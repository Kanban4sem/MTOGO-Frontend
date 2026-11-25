import { useState } from 'react'
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
	const [pendingOrderId, setPendingOrderId] = useState(null)
	const [updateError, setUpdateError] = useState('')
	const [updatedOrder, setUpdatedOrder] = useState(null)

	function refreshOrders() {
		setUpdateError('')
		setUpdatedOrder(null)
		reload()
	}

	async function changeStatus(orderId, status) {
		setPendingOrderId(orderId)
		setUpdateError('')
		setUpdatedOrder(null)
		try {
			const order = await updateRestaurantOrderStatus(orderId, status)
			updateData((currentOrders) =>
				currentOrders.map((current) =>
					current.id === order.id ? order : current,
				),
			)
			setUpdatedOrder(order)
		} catch (error) {
			if (error.status === 409) {
				refreshOrders()
				setUpdateError('Ordren har ændret status. Listen opdateres.')
			} else {
				setUpdateError(error.message)
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
		updateError,
		updatedOrder,
		changeStatus,
		refreshOrders,
	}
}
