import messages from '@/shared/components/Notification/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useEffect } from 'react'
import styles from '@/shared/components/Notification/Notification.module.css'

const DURATION_MS = 4000
const ICONS = { success: '✓', warning: '!', error: '!' }

export default function Notification({ id, label, color, onDismiss }) {
	const t = useTranslations(messages)
	useEffect(() => {
		const timeout = window.setTimeout(() => onDismiss(id), DURATION_MS)
		return () => window.clearTimeout(timeout)
	}, [id, onDismiss])

	return (
		<div className={styles.notification} data-color={color}>
			<span className={styles.icon} aria-hidden="true">
				{ICONS[color]}
			</span>
			<p className={styles.label}>{label}</p>
			<button
				type="button"
				className={styles.close}
				aria-label={t('dismissNotification')}
				onClick={() => onDismiss(id)}
			/>
		</div>
	)
}
