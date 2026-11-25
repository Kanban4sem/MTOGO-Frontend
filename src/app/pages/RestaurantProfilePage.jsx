import { Helmet } from 'react-helmet-async'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import RestaurantProfile from '@/features/restaurant-profile-page/RestaurantProfile/RestaurantProfile.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'

export default function RestaurantProfilePage() {
	return (
		<>
			<Helmet title="Virksomhedsprofil" />
			<ProtectedRoute requiredRole={USER_ROLES.RESTAURANT}>
				<RestaurantProfile />
			</ProtectedRoute>
		</>
	)
}
