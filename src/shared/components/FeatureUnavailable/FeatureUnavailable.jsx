import messages from '@/shared/components/FeatureUnavailable/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import styles from '@/shared/components/FeatureUnavailable/FeatureUnavailable.module.css'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'

const PAUSE_MESSAGE_KEYS = {
	[MAINTENANCE_FEATURES.AUTHENTICATION]: 'authPaused',
	[MAINTENANCE_FEATURES.ORDERING]: 'orderingPaused',
}

export default function FeatureUnavailable({ feature }) {
	const t = useTranslations(messages)
	const message = t(PAUSE_MESSAGE_KEYS[feature] ?? 'featurePaused')
	return (
		<div className={styles.hint} role="status">
			<span className={styles.icon} aria-hidden="true">
				!
			</span>
			<p>{message}</p>
		</div>
	)
}
