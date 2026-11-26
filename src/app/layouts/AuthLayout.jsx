import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import MaintenanceGate from '@/shared/components/MaintenanceGate/MaintenanceGate.jsx'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'

function AuthLayout({ title, children }) {
	return (
		<div className="authLayout">
			<Helmet title={title} />
			<main>
				<Link className="authBackLink" to="/">
					Tilbage til forsiden
				</Link>
				<MaintenanceGate feature={MAINTENANCE_FEATURES.AUTHENTICATION}>
					{children}
				</MaintenanceGate>
			</main>
		</div>
	)
}

export default AuthLayout
