import messages from '@/features/checkout-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import Checkout from '@/features/checkout-page/Checkout/Checkout.jsx'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import MaintenanceGate from '@/shared/components/MaintenanceGate/MaintenanceGate.jsx'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'

export default function CheckoutPage() {
	const t = useTranslations(messages)
	return (
		<>
			<Helmet title={t('ordering')} />
			<MaintenanceGate
				feature={MAINTENANCE_FEATURES.ORDERING}
				keepOpenOnPause
			>
				<ProtectedRoute>
					<Checkout />
				</ProtectedRoute>
			</MaintenanceGate>
		</>
	)
}
