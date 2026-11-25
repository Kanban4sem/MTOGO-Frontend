import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import CustomerOrders from '@/features/customer-orders-page/CustomerOrders/CustomerOrders.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function CustomerOrdersPage() {
	const { orderId } = useParams()
	const { user } = useAuth()

	return (
		<>
			<Helmet
				title={
					orderId === undefined
						? 'Mine ordrer'
						: `Ordre nr. ${orderId}`
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
