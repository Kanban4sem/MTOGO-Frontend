// Addresses that more than one place links to, so a route change is made in one place.
export const CHECKOUT_PATH = '/checkout'

export const RESTAURANT_MENU_ROUTE = '/restaurant/:restaurantId/menu'

export function getRestaurantMenuPath(restaurantId) {
	return `/restaurant/${restaurantId}/menu`
}

export const ORDER_CONFIRMATION_ROUTE = '/orders/:orderId'

export function getOrderConfirmationPath(orderId) {
	return `/orders/${orderId}`
}
