import { useCallback, useRef, useState } from 'react'
import Notification from '@/shared/components/Notification/Notification.jsx'
import { NotificationContext } from '@/shared/context/NotificationContext.jsx'
import { DEFAULT_LANGUAGE } from '@/shared/i18n/language.js'
import { useLanguage } from '@/shared/i18n/useLanguage.js'
import styles from '@/shared/components/Notification/Notification.module.css'

export function NotificationProvider({ children, bottomAction }) {
	const { language } = useLanguage()
	const [notifications, setNotifications] = useState([])
	const nextId = useRef(0)

	const notify = useCallback((localize, color) => {
		const label = localize(DEFAULT_LANGUAGE)
		const notification = { id: ++nextId.current, label, localize, color }
		setNotifications((current) => {
			if (
				current.some(
					(item) => item.label === label && item.color === color,
				)
			) {
				return current
			}
			return [...current, notification]
		})
	}, [])

	const dismiss = useCallback((id) => {
		setNotifications((current) => current.filter((item) => item.id !== id))
	}, [])

	return (
		<NotificationContext.Provider value={notify}>
			{children}
			<div className={styles.viewport}>
				<div
					className={styles.notifications}
					aria-live="polite"
					aria-relevant="additions"
				>
					{notifications.map(({ id, localize, color }) => (
						<Notification
							key={id}
							id={id}
							label={localize(language)}
							color={color}
							onDismiss={dismiss}
						/>
					))}
				</div>
				{bottomAction}
			</div>
		</NotificationContext.Provider>
	)
}
