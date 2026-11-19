import { useParams } from 'react-router-dom'
import OrderConfirmation from '@/features/order/OrderConfirmation/OrderConfirmation.jsx'
import FeatureFlagRoute from '@/app/routes/FeatureFlagRoute.jsx'

export default function OrderConfirmationPage() {
	const { orderId } = useParams()
	return (
		<FeatureFlagRoute flag="orderingEnabled">
			<OrderConfirmation orderId={orderId} />
		</FeatureFlagRoute>
	)
}
