import { Helmet } from 'react-helmet-async'
import Checkout from '@/features/checkout-page/Checkout/Checkout.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import FeatureFlagRoute from '@/app/routes/FeatureFlagRoute.jsx'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'

export default function CheckoutPage() {
	return (
		<FeatureFlagRoute flag="orderingEnabled">
			<Helmet title="Bestilling" />
			<ProtectedRoute
				loginUnavailable={
					<RequestState title="Bestilling kræver login">
						Login er ikke tilgængeligt lige nu, så du kan ikke
						bestille. Din kurv er gemt.
					</RequestState>
				}
			>
				<Checkout />
			</ProtectedRoute>
		</FeatureFlagRoute>
	)
}
