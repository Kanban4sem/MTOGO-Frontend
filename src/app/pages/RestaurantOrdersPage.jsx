import messages from '@/features/restaurant-orders-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import RestaurantOrders from '@/features/restaurant-orders-page/RestaurantOrders/RestaurantOrders.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function RestaurantOrdersPage() {
	const t = useTranslations(messages)
	const { user } = useAuth()

	return (
		<>
			<Helmet title={t('orders')} />
			<ProtectedRoute requiredRole={USER_ROLES.RESTAURANT}>
				<RestaurantOrders key={user?.id} />
			</ProtectedRoute>
		</>
	)
}
