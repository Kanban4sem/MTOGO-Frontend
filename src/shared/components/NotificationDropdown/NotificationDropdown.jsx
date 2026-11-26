import { useState } from 'react'
import { Link } from 'react-router-dom'
import Dropdown from '@/shared/components/Dropdown/Dropdown.jsx'
import { useOrderNotifications } from '@/shared/components/NotificationDropdown/NotificationDropdown.hooks.js'
import styles from '@/shared/components/NotificationDropdown/NotificationDropdown.module.css'
import { useNotificationMessage } from '@/shared/hooks/useNotification.js'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import { getCustomerOrderFeedbackPath } from '@/shared/data/paths.js'

export default function NotificationDropdown({ enabled }) {
	const [isOpen, setIsOpen] = useState(false)
	const { notifications, isLoading, loadError, readError } =
		useOrderNotifications(enabled, isOpen)
	const unreadCount = notifications.filter(({ read }) => !read).length
	useNotificationMessage(isOpen ? loadError : '')
	useNotificationMessage(isOpen && unreadCount > 0 ? readError : '')
	const label = unreadCount
		? `Notifikationer, ${unreadCount} ${unreadCount === 1 ? 'ulæst' : 'ulæste'}`
		: 'Notifikationer'

	return (
		<Dropdown
			label={
				<>
					<svg
						aria-hidden="true"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21a2 2 0 0 0 4 0" />
					</svg>
					{unreadCount > 0 && (
						<span className={styles.count} aria-hidden="true">
							{unreadCount}
						</span>
					)}
				</>
			}
			ariaLabel={label}
			className={styles.dropdown}
			buttonClassName={styles.button}
			listClassName={styles.notifications}
			openOnHover={false}
			onOpenChange={setIsOpen}
		>
			{isLoading && (
				<li className={styles.empty} role="status">
					Henter notifikationer…
				</li>
			)}
			{!isLoading && !loadError && notifications.length === 0 && (
				<li className={styles.empty}>Du har ingen notifikationer.</li>
			)}
			{notifications.map(({ id, orderId, status, statusName }) => (
				<li className={styles.notification} key={id}>
					<span>
						Ordre #{orderId} · {statusName.danish}
					</span>
					{status === ORDER_STATUS.DELIVERED && (
						<Link
							className={styles.feedback}
							to={getCustomerOrderFeedbackPath(orderId)}
							aria-label={`Feedback til ordre ${orderId}`}
						>
							Feedback
						</Link>
					)}
				</li>
			))}
		</Dropdown>
	)
}
