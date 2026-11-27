import messages from '@/app/routes/ProtectedRoute.messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
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
	const t = useTranslations(messages)
	const { user, isAuthenticated, isLoading, isSessionExpired } = useAuth()
	const { pathname, search } = useLocation()

	if (isLoading) {
		return <RequestState title={t('checkingLogin')} isLoading />
	}
	if (isAuthenticated) {
		if (requiredRole && user.role !== requiredRole) {
			return (
				<DeniedLayout>
					<RequestState title={t('accessDenied')} />
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
