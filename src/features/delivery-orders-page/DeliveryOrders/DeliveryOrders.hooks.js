import { useRef, useState } from 'react'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import {
	useNotification,
	useRequestErrorNotification,
} from '@/shared/hooks/useNotification.js'
import { useRequest } from '@/shared/hooks/useRequest.js'
import {
	getDeliveryAgentOrders,
	updateDeliveryOrder,
} from '@/features/delivery-orders-page/services/deliveryOrderService.js'

export function useDeliveryOrders(available) {
	const {
		data: orders = [],
		isLoading,
		error,
		reload,
		updateData,
	} = useRequest(getDeliveryAgentOrders)
	useRequestErrorNotification(
		error,
		error && `Vi kunne ikke hente ordrerne. ${error.message}`,
	)
	const [filter, setFilter] = useState('active')
	const [pendingOrderId, setPendingOrderId] = useState(null)
	const notify = useNotification()
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

	function refreshOrders() {
		if (updating.current) return
		reload()
	}

	async function changeOrder(orderId, action) {
		if (updating.current || isLoading) return
		updating.current = true
		setPendingOrderId(orderId)
		try {
			const order = await updateDeliveryOrder(orderId, action)
			updateData((currentOrders) =>
				currentOrders.map((current) =>
					current.id === order.id ? order : current,
				),
			)
			const status = `Ordre nr. ${order.id} · ${order.statusName.danish}`
			notify(
				action === 'TAKE'
					? `${status} · Overtaget. Se den under Ordrer.`
					: status,
				'success',
			)
		} catch (error) {
			if (error.status === 404 || error.status === 409) {
				notify(
					'Ordren kan have ændret sig. Listen opdateres.',
					'warning',
				)
				reload()
			} else if (error.status !== 401) {
				notify(error.message, 'error')
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
		changeOrder,
		refreshOrders,
	}
}
