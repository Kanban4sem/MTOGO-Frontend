import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import { getOrderStatusName } from '@/shared/data/orderStatus.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/restaurant-orders-page/messages.json'
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
	useRequestErrorNotification(error, (language) =>
		translate(messages, language, 'ordersFailed', {
			message: getRequestErrorMessage(error, language),
		}),
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
				(language) =>
					translate(messages, language, 'orderStatus', {
						id: order.id,
						statusName: getOrderStatusName(order, language),
					}),
				'success',
			)
		} catch (error) {
			if (error.status === 404 || error.status === 409) {
				reload()
				notify(
					(language) => translate(messages, language, 'orderChanged'),
					'warning',
				)
			} else if (error.status !== 401) {
				notify(
					(language) => getRequestErrorMessage(error, language),
					'error',
				)
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
