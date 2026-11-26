import styles from '@/shared/components/FeatureUnavailable/FeatureUnavailable.module.css'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'

const PAUSE_MESSAGES = {
	[MAINTENANCE_FEATURES.AUTHENTICATION]:
		'Login og registrering er midlertidigt utilgængelige.',
	[MAINTENANCE_FEATURES.ORDERING]:
		'Det er midlertidigt ikke muligt at afgive nye bestillinger.',
}

export default function FeatureUnavailable({ feature }) {
	const message =
		PAUSE_MESSAGES[feature] ??
		'Denne funktion er midlertidigt utilgængelig.'
	return (
		<div className={styles.hint} role="status">
			<span className={styles.icon} aria-hidden="true">
				!
			</span>
			<p>{message}</p>
		</div>
	)
}
