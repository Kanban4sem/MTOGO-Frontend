import {
	getRestaurants,
	getRestaurantMenus,
} from '@/api/endpoints/restaurants.js'

export async function getRestaurantDirectory(signal, limit) {
	const restaurants = await getRestaurants({ signal })
	const availableRestaurants = restaurants.filter(
		(restaurant) => restaurant.acceptsOrders,
	)

	return Promise.all(
		availableRestaurants.slice(0, limit).map(async (restaurant) => {
			try {
				const menus = await getRestaurantMenus(restaurant.id, {
					signal,
				})
				const items = menus.flatMap((menu) => menu.items)
				return { ...restaurant, preview: items[0] ?? null }
			} catch (error) {
				if (error.name === 'AbortError') throw error
				return { ...restaurant, preview: null }
			}
		}),
	)
}

export async function getRestaurantDetails(restaurantId, signal) {
	const [restaurants, menus] = await Promise.all([
		getRestaurants({ signal }),
		getRestaurantMenus(restaurantId, { signal }),
	])
	const restaurant = restaurants.find(
		(restaurant) =>
			String(restaurant.id) === restaurantId && restaurant.acceptsOrders,
	)

	if (!restaurant) {
		const error = new Error('Restaurant not found')
		error.status = 404
		throw error
	}

	return { restaurant, menus }
}
