import { Helmet } from 'react-helmet-async'
import FeatureFlagRoute from '@/app/routes/FeatureFlagRoute.jsx'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import RestaurantOrders from '@/features/restaurant-orders-page/RestaurantOrders/RestaurantOrders.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function RestaurantOrdersPage() {
	const { user } = useAuth()

	return (
		<FeatureFlagRoute flag="orderingEnabled">
			<Helmet title="Ordrer" />
			<ProtectedRoute
				requiredRole={USER_ROLES.RESTAURANT}
				loginUnavailable={
					<RequestState title="Ordrevisning kræver login">
						Login er ikke tilgængeligt lige nu.
					</RequestState>
				}
			>
				<RestaurantOrders key={user?.id} />
			</ProtectedRoute>
		</FeatureFlagRoute>
	)
}
