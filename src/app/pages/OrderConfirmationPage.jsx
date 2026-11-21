import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import OrderConfirmation from '@/features/order-confirmation-page/OrderConfirmation/OrderConfirmation.jsx'
import FeatureFlagRoute from '@/app/routes/FeatureFlagRoute.jsx'

export default function OrderConfirmationPage() {
	const { orderId } = useParams()
	return (
		<FeatureFlagRoute flag="orderingEnabled">
			<Helmet title="Ordrebekræftelse" />
			<OrderConfirmation orderId={orderId} />
		</FeatureFlagRoute>
	)
}
