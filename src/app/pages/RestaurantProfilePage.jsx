import { Helmet } from 'react-helmet-async'
import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'
import AccountDetails from '@/shared/components/AccountDetails/AccountDetails.jsx'
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
				<section
					className="profilePage"
					aria-labelledby="restaurant-profile-title"
				>
					<h1 id="restaurant-profile-title">Virksomhedsprofil</h1>
					<AccountDetails user={user} />
				</section>
			</ProtectedRoutes>
		</>
	)
}
