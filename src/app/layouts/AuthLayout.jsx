import messages from '@/app/layouts/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import LanguageIndicator from '@/shared/components/LanguageIndicator/LanguageIndicator.jsx'
import MaintenanceGate from '@/shared/components/MaintenanceGate/MaintenanceGate.jsx'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'

function AuthLayout({ title, children }) {
	const t = useTranslations(messages)
	return (
		<div className="authLayout">
			<Helmet title={title} />
			<main>
				<div className="authNavigation">
					<Link className="authBackLink" to="/">
						{t('backHome')}
					</Link>
					<LanguageIndicator />
				</div>
				<MaintenanceGate feature={MAINTENANCE_FEATURES.AUTHENTICATION}>
					{children}
				</MaintenanceGate>
			</main>
		</div>
	)
}

export default AuthLayout
