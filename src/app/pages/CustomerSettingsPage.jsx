import messages from '@/features/customer-settings-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import CustomerSettings from '@/features/customer-settings-page/CustomerSettings/CustomerSettings.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function CustomerSettingsPage() {
	const t = useTranslations(messages)
	const { user } = useAuth()

	return (
		<>
			<Helmet title={t('settings')} />
			<ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
				<CustomerSettings key={user?.id} />
			</ProtectedRoute>
		</>
	)
}
