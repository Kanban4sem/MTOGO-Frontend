import { useCallback, useState } from 'react'
import { getRestaurantDetails } from '@/shared/services/restaurantService.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { useRequest } from '@/shared/hooks/useRequest.js'

export function useRestaurantMenu(restaurantId) {
	const loadMenu = useCallback(
		(signal) => getRestaurantDetails(restaurantId, signal),
		[restaurantId],
	)
	const { data, isLoading, error } = useRequest(loadMenu)
	return {
		restaurant: data?.restaurant ?? null,
		menus: data?.menus ?? [],
		isLoading,
		error,
	}
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
