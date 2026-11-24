import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'
import AccountDetails from '@/shared/components/AccountDetails/AccountDetails.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { CUSTOMER_ORDERS_PATH } from '@/shared/data/paths.js'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useCanSeeCustomerOrders } from '@/shared/hooks/useCanSeeCustomerOrders.js'

// Not limited to customers: any logged-in user who opens the profile sees their own account details.
export default function ProfilePage() {
	const { user } = useAuth()
	const canSeeCustomerOrders = useCanSeeCustomerOrders()

	return (
		<>
			<Helmet title="Min profil" />
			<ProtectedRoutes
				loginUnavailable={
					<RequestState title="Din profil kræver login">
						Login er ikke tilgængeligt lige nu.
					</RequestState>
				}
			>
				<section
					className="profilePage"
					aria-labelledby="profile-title"
				>
					<h1 id="profile-title">Min profil</h1>
					<AccountDetails user={user} />
					{canSeeCustomerOrders && (
						<p>
							<Link to={CUSTOMER_ORDERS_PATH}>Mine ordrer</Link>
						</p>
					)}
				</section>
			</ProtectedRoutes>
		</>
	)
}
