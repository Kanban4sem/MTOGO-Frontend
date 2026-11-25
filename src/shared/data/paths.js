// Addresses that more than one place links to, so a route change is made in one place.
export const CHECKOUT_PATH = '/checkout'

export const RESTAURANTS_PATH = '/restaurants'
export const RESTAURANT_MENU_ROUTE = '/restaurant/:restaurantId/menu'

export function getRestaurantMenuPath(restaurantId) {
	return `/restaurant/${restaurantId}/menu`
}

export const ORDER_CONFIRMATION_ROUTE = '/orders/:orderId'

export function getOrderConfirmationPath(orderId) {
	return `/orders/${orderId}`
}

export const CUSTOMER_ORDERS_PATH = '/profile/orders'
export const CUSTOMER_SETTINGS_PATH = '/profile/settings'
export const RESTAURANT_ORDERS_PATH = '/restaurant/orders'
export const RESTAURANT_PROFILE_PATH = '/restaurant/profile'
export const DASHBOARD_PATH = '/dashboard'
export const DASHBOARD_ORDERS_PATH = `${DASHBOARD_PATH}/orders`
export const CUSTOMER_ORDER_ROUTE = `${CUSTOMER_ORDERS_PATH}/:orderId`

export function getCustomerOrderPath(orderId) {
	return `${CUSTOMER_ORDERS_PATH}/${orderId}`
}
