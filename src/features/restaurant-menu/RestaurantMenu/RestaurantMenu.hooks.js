import { useEffect, useState } from 'react'
import { getRestaurantDetails } from '@/shared/services/restaurantService.js'

export function useRestaurantMenu(restaurantId) {
	const [state, setState] = useState({
		restaurant: null,
		menus: [],
		isLoading: true,
		error: null,
	})

	useEffect(() => {
		const controller = new AbortController()

		getRestaurantDetails(restaurantId, controller.signal)
			.then(({ restaurant, menus }) => {
				if (!controller.signal.aborted) {
					setState({
						restaurant,
						menus,
						isLoading: false,
						error: null,
					})
				}
			})
			.catch((error) => {
				if (!controller.signal.aborted) {
					setState({
						restaurant: null,
						menus: [],
						isLoading: false,
						error,
					})
				}
			})

		return () => controller.abort()
	}, [restaurantId])

	return state
}
