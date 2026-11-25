import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import ProfileOverview from '@/shared/components/ProfileOverview/ProfileOverview.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import {
	CUSTOMER_ORDERS_PATH,
	CUSTOMER_SETTINGS_PATH,
} from '@/shared/data/paths.js'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

// Not limited to customers: any logged-in user who opens the profile sees their own account details.
export default function ProfilePage() {
	const { user } = useAuth()
	const isCustomer = user?.role === USER_ROLES.CUSTOMER

	return (
		<>
			<Helmet title="Min profil" />
			<ProtectedRoute
				loginUnavailable={
					<RequestState title="Din profil kræver login">
						Login er ikke tilgængeligt lige nu.
					</RequestState>
				}
			>
				<ProfileOverview
					title="Min profil"
					user={user}
					actions={
						isCustomer && (
							<>
								<Link to={CUSTOMER_ORDERS_PATH}>
									Mine ordrer
								</Link>
								<Link to={CUSTOMER_SETTINGS_PATH}>
									Indstillinger
								</Link>
							</>
						)
					}
				/>
			</ProtectedRoute>
		</>
	)
}
