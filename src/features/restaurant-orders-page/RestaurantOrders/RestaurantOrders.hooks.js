import { useEffect, useState } from 'react'
import {
	readRestaurantOrders,
	updateRestaurantOrderStatus,
} from '@/features/restaurant-orders-page/services/restaurantOrderService.js'

export function useRestaurantOrders() {
	const [request, setRequest] = useState({ isLoading: true })
	const [refreshCount, setRefreshCount] = useState(0)
	const [pendingOrderId, setPendingOrderId] = useState(null)
	const [updateError, setUpdateError] = useState('')
	const [updatedOrder, setUpdatedOrder] = useState(null)

	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller

		async function loadOrders() {
			try {
				const orders = await readRestaurantOrders(signal)
				if (!signal.aborted) setRequest({ orders })
			} catch (error) {
				if (!signal.aborted) setRequest({ error })
			}
		}

		void loadOrders()
		return () => controller.abort()
	}, [refreshCount])

	function refreshOrders() {
		setUpdateError('')
		setUpdatedOrder(null)
		setRequest({ isLoading: true })
		setRefreshCount((count) => count + 1)
	}

	async function changeStatus(orderId, status) {
		setPendingOrderId(orderId)
		setUpdateError('')
		setUpdatedOrder(null)
		try {
			const order = await updateRestaurantOrderStatus(orderId, status)
			setRequest(({ orders }) => ({
				orders: orders.map((current) =>
					current.id === order.id ? order : current,
				),
			}))
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
		...request,
		pendingOrderId,
		updateError,
		updatedOrder,
		changeStatus,
		refreshOrders,
	}
}
