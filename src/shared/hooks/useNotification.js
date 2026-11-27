import { useContext, useEffect, useEffectEvent, useRef } from 'react'
import { NotificationContext } from '@/shared/context/NotificationContext.jsx'
import { DEFAULT_LANGUAGE } from '@/shared/i18n/language.js'
import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'

export function useNotification() {
	return useContext(NotificationContext)
}

export function useRequestErrorNotification(error, localize) {
	useNotificationMessage(
		error?.status === 401 ? null : error,
		localize ?? ((language) => getRequestErrorMessage(error, language)),
	)
}

export function useNotificationMessage(trigger, localize, color = 'error') {
	const notify = useNotification()
	const previousLabel = useRef(null)
	const getMessage = useEffectEvent(() => localize)

	useEffect(() => {
		const message = trigger ? getMessage() : null
		const label = message?.(DEFAULT_LANGUAGE)
		if (label && label !== previousLabel.current) {
			notify(message, color)
		}
		previousLabel.current = label
	}, [trigger, color, notify])
}
