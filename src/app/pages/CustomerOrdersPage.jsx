import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import FeatureFlagRoute from '@/app/routes/FeatureFlagRoute.jsx'
import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'
import CustomerOrders from '@/features/customer-orders-page/CustomerOrders/CustomerOrders.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function CustomerOrdersPage() {
	const { orderId } = useParams()
	const { user } = useAuth()

	return (
		<FeatureFlagRoute flag="orderingEnabled">
			<Helmet
				title={
					orderId === undefined
						? 'Mine ordrer'
						: `Ordre nr. ${orderId}`
				}
			/>
			<ProtectedRoutes
				loginUnavailable={
					<RequestState title="Ordrevisning kræver login">
						Login er ikke tilgængeligt lige nu.
					</RequestState>
				}
			>
				<CustomerOrders
					key={`${user?.id}:${orderId ?? ''}`}
					orderId={orderId}
				/>
			</ProtectedRoutes>
		</FeatureFlagRoute>
	)
}
