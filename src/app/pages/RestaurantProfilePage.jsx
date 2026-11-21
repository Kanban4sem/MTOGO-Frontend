import { Helmet } from 'react-helmet-async'
import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'
import styles from './RestaurantProfilePage.module.css'

export default function RestaurantProfilePage() {
	const { user } = useAuth()
	const profile = user?.profile
	const name = [profile?.firstName, profile?.lastName]
		.filter(Boolean)
		.join(' ')

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
					className={styles.page}
					aria-labelledby="restaurant-profile-title"
				>
					<h1 id="restaurant-profile-title">Virksomhedsprofil</h1>
					<dl>
						{name && (
							<>
								<dt>Navn</dt>
								<dd>{name}</dd>
							</>
						)}
						<dt>E-mail</dt>
						<dd>{user?.email}</dd>
						{profile?.phoneNumber && (
							<>
								<dt>Telefon</dt>
								<dd>{profile.phoneNumber}</dd>
							</>
						)}
					</dl>
				</section>
			</ProtectedRoutes>
		</>
	)
}
