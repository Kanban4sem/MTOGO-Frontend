import { useEffect, useState } from 'react'
import { getRestaurantDetails } from '@/shared/services/restaurantService.js'
import { useBasket } from '@/shared/hooks/useBasket.js'

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

export function useMenuBasket(restaurant) {
	const { addMenuItem, isFromOtherRestaurant } = useBasket()
	const [menuItemAwaitingNewBasket, setMenuItemAwaitingNewBasket] =
		useState(null)

	function requestAdd(menuItem) {
		if (isFromOtherRestaurant(restaurant.id)) {
			setMenuItemAwaitingNewBasket(menuItem)
		} else {
			addMenuItem(restaurant, menuItem)
		}
	}

	function startNewBasket() {
		addMenuItem(restaurant, menuItemAwaitingNewBasket)
		setMenuItemAwaitingNewBasket(null)
	}

	function keepBasket() {
		setMenuItemAwaitingNewBasket(null)
	}

	return {
		requestAdd,
		menuItemAwaitingNewBasket,
		startNewBasket,
		keepBasket,
	}
}
