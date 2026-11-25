import { Helmet } from 'react-helmet-async'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import CustomerSettings from '@/features/customer-settings-page/CustomerSettings/CustomerSettings.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function CustomerSettingsPage() {
	const { user } = useAuth()

	return (
		<>
			<Helmet title="Indstillinger" />
			<ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
				<CustomerSettings key={user?.id} />
			</ProtectedRoute>
		</>
	)
}
