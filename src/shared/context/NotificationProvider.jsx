import { useCallback, useRef, useState } from 'react'
import Notification from '@/shared/components/Notification/Notification.jsx'
import { NotificationContext } from '@/shared/context/NotificationContext.jsx'
import styles from '@/shared/components/Notification/Notification.module.css'

export function NotificationProvider({ children }) {
	const [notifications, setNotifications] = useState([])
	const nextId = useRef(0)

	const notify = useCallback((label, color) => {
		const notification = { id: ++nextId.current, label, color }
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
			<div
				className={styles.viewport}
				aria-live="polite"
				aria-relevant="additions"
			>
				{notifications.map(({ id, label, color }) => (
					<Notification
						key={id}
						id={id}
						label={label}
						color={color}
						onDismiss={dismiss}
					/>
				))}
			</div>
		</NotificationContext.Provider>
	)
}
