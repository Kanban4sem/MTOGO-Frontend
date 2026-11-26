import { postCustomerOrderFeedback } from '@/api/endpoints/orders.js'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import { readOrderNotifications } from '@/shared/services/orderNotificationService.js'

export async function getOrderFeedbackAvailability(orderId, signal) {
	const notifications = await readOrderNotifications(signal)
	const delivery = notifications.find(
		(notification) =>
			notification.orderId === orderId &&
			notification.status === ORDER_STATUS.DELIVERED,
	)
	if (typeof delivery?.canGiveFeedback !== 'boolean') {
		throw new Error('Vi kunne ikke se, om du kan give feedback på ordren.')
	}
	return delivery.canGiveFeedback
}

export function submitOrderFeedback(orderId, feedback) {
	return postCustomerOrderFeedback(orderId, feedback)
}
