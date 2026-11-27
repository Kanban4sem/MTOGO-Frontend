import messages from '@/app/layouts/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Outlet } from 'react-router-dom'
import DashboardLayout from '@/app/layouts/DashboardLayout.jsx'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import { DASHBOARD_ORDERS_PATH, DASHBOARD_PATH } from '@/shared/data/paths.js'
import { USER_ROLES } from '@/shared/data/userRoles.js'

export default function DeliveryAgentLayout() {
	const t = useTranslations(messages)
	const links = [
		{ label: t('dashboard'), to: DASHBOARD_PATH },
		{ label: t('orders'), to: DASHBOARD_ORDERS_PATH },
	]
	return (
		<ProtectedRoute
			requiredRole={USER_ROLES.DELIVERY_AGENT}
			deniedLayout={HomeLayout}
		>
			<DashboardLayout label={t('deliveryAgent')} links={links}>
				<Outlet />
			</DashboardLayout>
		</ProtectedRoute>
	)
}
