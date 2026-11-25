import { Outlet } from 'react-router-dom'
import DashboardLayout from '@/app/layouts/DashboardLayout.jsx'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import { DASHBOARD_ORDERS_PATH, DASHBOARD_PATH } from '@/shared/data/paths.js'
import { USER_ROLES } from '@/shared/data/userRoles.js'

const LINKS = [
	{ label: 'Dashboard', to: DASHBOARD_PATH },
	{ label: 'Ordrer', to: DASHBOARD_ORDERS_PATH },
]

export default function DeliveryAgentLayout() {
	return (
		<ProtectedRoute
			requiredRole={USER_ROLES.DELIVERY_AGENT}
			deniedLayout={HomeLayout}
		>
			<DashboardLayout label="Leveringsbud" links={LINKS}>
				<Outlet />
			</DashboardLayout>
		</ProtectedRoute>
	)
}
