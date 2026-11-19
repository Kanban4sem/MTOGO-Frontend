import { Navigate, useLocation } from 'react-router-dom'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

// The one place that sends a logged-out user to login, and back to the same address afterwards.
// A 401 anywhere clears the session in the client, so an expired session lands here too.
export default function ProtectedRoutes({ loginUnavailable, children }) {
	const { isAuthenticated, isLoading, isSessionExpired } = useAuth()
	const { isEnabled } = useFeatureFlags()
	const { pathname, search } = useLocation()

	if (isLoading) {
		return <RequestState title="Vi tjekker dit login…" isLoading />
	}
	if (isAuthenticated) return children
	if (!isEnabled('authEnabled')) return loginUnavailable

	return (
		<Navigate
			to="/login"
			replace
			state={{
				returnTo: `${pathname}${search}`,
				sessionExpired: isSessionExpired,
			}}
		/>
	)
}
