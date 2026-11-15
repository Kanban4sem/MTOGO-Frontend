import { client } from '@/api/client.js'

export function getRestaurants(options = {}) {
	return client('/restaurants', options)
}

export function getRestaurantMenus(restaurantId, options = {}) {
	return client(
		`/restaurants/${encodeURIComponent(restaurantId)}/menus`,
		options,
	)
}
