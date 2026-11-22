import { placeOrder } from '@/api/endpoints/orders.js'

// The payment is mocked: the backend declines the token `decline` and confirms any other.
export const PAYMENT_TOKENS = {
	CARD: 'mock-card',
	SIMULATED_DECLINE: 'decline',
}

// Prices and the country are never sent: the backend sets them when the order is placed.
export function placeOrderFromBasket(basket, addressSelection, paymentToken) {
	return placeOrder({
		lines: basket.lines.map(({ menuItemId, quantity }) => ({
			menuItemId,
			quantity,
		})),
		// Jackson requires both primitive boolean fields on the request record.
		useDefaultAddress: false,
		saveAsDefault: false,
		...addressSelection,
		paymentToken,
	})
}
