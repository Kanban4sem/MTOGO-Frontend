import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'

export default function ProfilePage() {
	return (
		<ProtectedRoutes
			loginUnavailable={
				<RequestState title="Din profil kræver login">
					Login er ikke tilgængeligt lige nu.
				</RequestState>
			}
		/>
	)
}
