import messages from '@/app/pages/ProfilePage.messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import ProfileOverview from '@/shared/components/ProfileOverview/ProfileOverview.jsx'
import {
	CUSTOMER_ORDERS_PATH,
	CUSTOMER_SETTINGS_PATH,
} from '@/shared/data/paths.js'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

// Not limited to customers: any logged-in user who opens the profile sees their own account details.
export default function ProfilePage() {
	const t = useTranslations(messages)
	const { user } = useAuth()
	const isCustomer = user?.role === USER_ROLES.CUSTOMER

	return (
		<>
			<Helmet title={t('myProfile')} />
			<ProtectedRoute>
				<ProfileOverview
					title={t('myProfile')}
					user={user}
					actions={
						isCustomer && (
							<>
								<Link to={CUSTOMER_ORDERS_PATH}>
									{t('myOrders')}
								</Link>
								<Link to={CUSTOMER_SETTINGS_PATH}>
									{t('settings')}
								</Link>
							</>
						)
					}
				/>
			</ProtectedRoute>
		</>
	)
}
