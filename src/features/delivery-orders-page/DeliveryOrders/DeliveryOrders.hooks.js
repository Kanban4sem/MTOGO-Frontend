import { useEffect, useRef, useState } from 'react'
import {
	readDeliveryOrders,
	updateDeliveryOrder,
} from '@/features/delivery-orders-page/services/deliveryOrderService.js'

const ORDER_UPDATE_DURATION_MS = 4000

export function useDeliveryOrders() {
	const [request, setRequest] = useState({ isLoading: true })
	const [refreshCount, setRefreshCount] = useState(0)
	const [pendingOrderId, setPendingOrderId] = useState(null)
	const [orderUpdate, setOrderUpdate] = useState(null)
	const updating = useRef(false)

	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller

		async function loadOrders() {
			try {
				const orders = await readDeliveryOrders(signal)
				if (!signal.aborted) setRequest({ orders })
			} catch (error) {
				if (!signal.aborted) setRequest({ error })
			}
		}

		void loadOrders()
		return () => controller.abort()
	}, [refreshCount])

	useEffect(() => {
		if (!orderUpdate) return
		const timeout = setTimeout(() => {
			setOrderUpdate((current) =>
				current === orderUpdate ? null : current,
			)
		}, ORDER_UPDATE_DURATION_MS)
		return () => clearTimeout(timeout)
	}, [orderUpdate])

	function reloadOrders() {
		setRequest({ isLoading: true })
		setRefreshCount((count) => count + 1)
	}

	function refreshOrders() {
		if (updating.current) return
		setOrderUpdate(null)
		reloadOrders()
	}

	async function changeOrder(orderId, action) {
		if (updating.current || request.isLoading) return
		updating.current = true
		setPendingOrderId(orderId)
		setOrderUpdate(null)
		try {
			const order = await updateDeliveryOrder(orderId, action)
			setRequest(({ orders }) => ({
				orders: orders.map((current) =>
					current.id === order.id ? order : current,
				),
			}))
			setOrderUpdate({ order, action })
		} catch (error) {
			if (error.status === 404 || error.status === 409) {
				setOrderUpdate({
					error: 'Ordren kan have ændret sig. Listen opdateres.',
				})
				reloadOrders()
			} else {
				setOrderUpdate({ error: error.message })
			}
		} finally {
			updating.current = false
			setPendingOrderId(null)
		}
	}

	return {
		...request,
		pendingOrderId,
		orderUpdate,
		changeOrder,
		refreshOrders,
	}
}
