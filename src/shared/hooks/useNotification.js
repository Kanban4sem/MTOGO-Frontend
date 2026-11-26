import { useContext, useEffect, useRef } from 'react'
import { NotificationContext } from '@/shared/context/NotificationContext.jsx'

export function useNotification() {
	return useContext(NotificationContext)
}

export function useRequestErrorNotification(error, message = error?.message) {
	useNotificationMessage(error?.status === 401 ? '' : message)
}

export function useNotificationMessage(message, color = 'error') {
	const notify = useNotification()
	const previousMessage = useRef(undefined)

	useEffect(() => {
		if (message && message !== previousMessage.current) {
			notify(message, color)
		}
		previousMessage.current = message
	}, [message, color, notify])
}
