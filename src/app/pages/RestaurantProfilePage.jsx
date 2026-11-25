import { Helmet } from 'react-helmet-async'
import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'
import ProfileOverview from '@/shared/components/ProfileOverview/ProfileOverview.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function RestaurantProfilePage() {
	const { user } = useAuth()

	return (
		<>
			<Helmet title="Virksomhedsprofil" />
			<ProtectedRoutes
				requiredRole={USER_ROLES.RESTAURANT}
				loginUnavailable={
					<RequestState title="Virksomhedsprofil kræver login">
						Login er ikke tilgængeligt lige nu.
					</RequestState>
				}
			>
				<ProfileOverview title="Virksomhedsprofil" user={user} />
			</ProtectedRoutes>
		</>
	)
}
