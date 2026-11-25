import { Helmet } from 'react-helmet-async'
import Checkout from '@/features/checkout-page/Checkout/Checkout.jsx'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'

export default function CheckoutPage() {
	return (
		<>
			<Helmet title="Bestilling" />
			<ProtectedRoute>
				<Checkout />
			</ProtectedRoute>
		</>
	)
}
