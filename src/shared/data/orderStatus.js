import messages from '@/shared/data/orderStatus.messages.json'

export const ORDER_STATUS = {
	PLACED: 'PLACED',
	ACCEPTED: 'ACCEPTED',
	REJECTED: 'REJECTED',
	READY: 'READY',
	PICKED_UP: 'PICKED_UP',
	DELIVERED: 'DELIVERED',
}

export function getOrderStatusName({ status, statusName }, language) {
	const names =
		typeof statusName === 'string' ? { danish: statusName } : statusName
	const isEnglish = language === 'en'
	const preferredName = isEnglish ? names?.english : names?.danish
	const fallbackName = Object.hasOwn(ORDER_STATUS, status)
		? messages[isEnglish ? 'en' : 'da'][status]
		: ''
	const otherName = isEnglish ? names?.danish : names?.english
	return preferredName || fallbackName || otherName || ''
}
