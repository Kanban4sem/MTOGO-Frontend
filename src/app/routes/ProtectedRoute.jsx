import { Fragment } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { LOGIN_PATH } from '@/shared/data/paths.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

// The one place that sends a logged-out user to login, and back to the same address afterwards.
// A 401 anywhere clears the session in the client, so an expired session lands here too.
export default function ProtectedRoute({
	requiredRole,
	deniedLayout: DeniedLayout = Fragment,
	children,
}) {
	const { user, isAuthenticated, isLoading, isSessionExpired } = useAuth()
	const { pathname, search } = useLocation()

	if (isLoading) {
		return <RequestState title="Vi tjekker dit login…" isLoading />
	}
	if (isAuthenticated) {
		if (requiredRole && user.role !== requiredRole) {
			return (
				<DeniedLayout>
					<RequestState title="Du har ikke adgang til denne side" />
				</DeniedLayout>
			)
		}
		return children
	}

	return (
		<Navigate
			to={LOGIN_PATH}
			replace
			state={{
				returnTo: `${pathname}${search}`,
				sessionExpired: isSessionExpired,
			}}
		/>
	)
}
