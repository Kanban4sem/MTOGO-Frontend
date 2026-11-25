import { useEffect, useRef, useState } from 'react'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import { useRequest } from '@/shared/hooks/useRequest.js'
import {
	getDeliveryAgentOrders,
	updateDeliveryOrder,
} from '@/features/delivery-orders-page/services/deliveryOrderService.js'

const ORDER_UPDATE_DURATION_MS = 4000

export function useDeliveryOrders(available) {
	const {
		data: orders = [],
		isLoading,
		error,
		reload,
		updateData,
	} = useRequest(getDeliveryAgentOrders)
	const [filter, setFilter] = useState('active')
	const [pendingOrderId, setPendingOrderId] = useState(null)
	const [orderUpdate, setOrderUpdate] = useState(null)
	const updating = useRef(false)

	const completed = filter === 'completed'
	const visibleOrders = orders.filter((order) => {
		if (available)
			return !order.assignedToMe && order.status === ORDER_STATUS.READY
		return (
			order.assignedToMe &&
			(completed
				? order.status === ORDER_STATUS.DELIVERED
				: order.status === ORDER_STATUS.READY ||
					order.status === ORDER_STATUS.PICKED_UP)
		)
	})

	useEffect(() => {
		if (!orderUpdate) return
		const timeout = setTimeout(() => {
			setOrderUpdate((current) =>
				current === orderUpdate ? null : current,
			)
		}, ORDER_UPDATE_DURATION_MS)
		return () => clearTimeout(timeout)
	}, [orderUpdate])

	function refreshOrders() {
		if (updating.current) return
		setOrderUpdate(null)
		reload()
	}

	async function changeOrder(orderId, action) {
		if (updating.current || isLoading) return
		updating.current = true
		setPendingOrderId(orderId)
		setOrderUpdate(null)
		try {
			const order = await updateDeliveryOrder(orderId, action)
			updateData((currentOrders) =>
				currentOrders.map((current) =>
					current.id === order.id ? order : current,
				),
			)
			setOrderUpdate({ order, action })
		} catch (error) {
			if (error.status === 404 || error.status === 409) {
				setOrderUpdate({
					error: 'Ordren kan have ændret sig. Listen opdateres.',
				})
				reload()
			} else {
				setOrderUpdate({ error: error.message })
			}
		} finally {
			updating.current = false
			setPendingOrderId(null)
		}
	}

	return {
		visibleOrders,
		isLoading,
		error,
		filter,
		setFilter,
		pendingOrderId,
		orderUpdate,
		changeOrder,
		refreshOrders,
	}
}
