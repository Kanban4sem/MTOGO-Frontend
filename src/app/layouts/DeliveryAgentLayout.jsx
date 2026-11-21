import { Outlet } from 'react-router-dom'
import DashboardLayout from '@/app/layouts/DashboardLayout.jsx'
import FeatureFlagRoute from '@/app/routes/FeatureFlagRoute.jsx'
import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'
import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { DASHBOARD_ORDERS_PATH, DASHBOARD_PATH } from '@/shared/data/paths.js'
import { USER_ROLES } from '@/shared/data/userRoles.js'

const LINKS = [
	{ label: 'Dashboard', to: DASHBOARD_PATH },
	{ label: 'Ordrer', to: DASHBOARD_ORDERS_PATH },
]

export default function DeliveryAgentLayout() {
	return (
		<FeatureFlagRoute flag="orderingEnabled" deniedLayout={HomeLayout}>
			<ProtectedRoutes
				requiredRole={USER_ROLES.DELIVERY_AGENT}
				deniedLayout={HomeLayout}
				loginUnavailable={
					<RequestState title="Dashboardet kræver login">
						Login er ikke tilgængeligt lige nu.
					</RequestState>
				}
			>
				<DashboardLayout label="Leveringsbud" links={LINKS}>
					<Outlet />
				</DashboardLayout>
			</ProtectedRoutes>
		</FeatureFlagRoute>
	)
}
