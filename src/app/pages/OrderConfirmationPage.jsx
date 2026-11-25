import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import OrderConfirmation from '@/features/order-confirmation-page/OrderConfirmation/OrderConfirmation.jsx'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function OrderConfirmationPage() {
	const { orderId } = useParams()
	const { user } = useAuth()

	return (
		<>
			<Helmet title="Ordrebekræftelse" />
			<ProtectedRoute requiredRole={USER_ROLES.CUSTOMER}>
				{/* A new user or order starts a fresh request, so the previous user's order is never shown. */}
				<OrderConfirmation
					key={`${user?.id}:${orderId}`}
					orderId={orderId}
				/>
			</ProtectedRoute>
		</>
	)
}
