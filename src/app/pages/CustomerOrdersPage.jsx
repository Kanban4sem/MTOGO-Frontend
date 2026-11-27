import messages from '@/features/customer-orders-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import CustomerOrders from '@/features/customer-orders-page/CustomerOrders/CustomerOrders.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function CustomerOrdersPage() {
	const t = useTranslations(messages)
	const { orderId } = useParams()
	const { user } = useAuth()

	return (
		<>
			<Helmet
				title={
					orderId === undefined
						? t('myOrders')
						: t('orderNumber', { orderId })
				}
			/>
			<ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
				<CustomerOrders
					key={`${user?.id}:${orderId ?? ''}`}
					orderId={orderId}
				/>
			</ProtectedRoute>
		</>
	)
}
