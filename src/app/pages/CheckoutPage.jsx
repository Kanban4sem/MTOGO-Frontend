import Checkout from '@/features/checkout-page/Checkout/Checkout.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import FeatureFlagRoute from '@/app/routes/FeatureFlagRoute.jsx'
import ProtectedRoutes from '@/app/routes/ProtectedRoutes.jsx'

export default function CheckoutPage() {
	return (
		<FeatureFlagRoute flag="orderingEnabled">
			<ProtectedRoutes
				loginUnavailable={
					<RequestState title="Bestilling kræver login">
						Login er ikke tilgængeligt lige nu, så du kan ikke
						bestille. Din kurv er gemt.
					</RequestState>
				}
			>
				<Checkout />
			</ProtectedRoutes>
		</FeatureFlagRoute>
	)
}
