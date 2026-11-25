import {
	getOrderNotifications,
	putOrderNotificationRead,
} from '@/api/endpoints/orders.js'

export function readOrderNotifications(signal) {
	return getOrderNotifications(signal)
}

export function markOrderNotificationAsRead(notificationId, signal) {
	return putOrderNotificationRead(notificationId, signal)
}
