import { Helmet } from 'react-helmet-async'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import RestaurantProfile from '@/features/restaurant-profile-page/RestaurantProfile/RestaurantProfile.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'

export default function RestaurantProfilePage() {
	return (
		<>
			<Helmet title="Virksomhedsprofil" />
			<ProtectedRoute
				requiredRole={USER_ROLES.RESTAURANT}
				loginUnavailable={
					<RequestState title="Virksomhedsprofil kræver login">
						Login er ikke tilgængeligt lige nu.
					</RequestState>
				}
			>
				<RestaurantProfile />
			</ProtectedRoute>
		</>
	)
}
