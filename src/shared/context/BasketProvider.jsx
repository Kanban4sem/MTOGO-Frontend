import { useEffect, useState } from 'react'
import { BasketContext } from '@/shared/context/BasketContext.jsx'
import { AUTH_SESSION_CLEARED } from '@/shared/utils/authSession.js'
import {
	EMPTY_BASKET,
	addMenuItem,
	changeQuantity,
	findLine,
	getBasketTotal,
	getItemCount,
	isFromOtherRestaurant,
	parseStoredBasket,
	removeMenuItem,
} from '@/shared/utils/basket.js'
import {
	getAddBlockedReason,
	getLimitMessage,
} from '@/shared/utils/basketMessages.js'

const BASKET_KEY = 'mtogo:basket'

// Storage can be blocked or full, as in private browsing, so the basket then lives only in memory.
function readStoredBasket() {
	try {
		return parseStoredBasket(localStorage.getItem(BASKET_KEY))
	} catch {
		return EMPTY_BASKET
	}
}

function storeBasket(basket) {
	try {
		if (basket.lines.length === 0) localStorage.removeItem(BASKET_KEY)
		else localStorage.setItem(BASKET_KEY, JSON.stringify(basket))
	} catch {
		// The basket still works for this page view.
	}
}

export function BasketProvider({ children }) {
	const [basket, setBasket] = useState(readStoredBasket)

	useEffect(() => {
		storeBasket(basket)
	}, [basket])

	useEffect(() => {
		function clearBasketOnLogout(event) {
			if (event.detail.expired) return
			storeBasket(EMPTY_BASKET)
			setBasket(EMPTY_BASKET)
		}

		function clearBasketAcrossTabs(event) {
			if (event.key === BASKET_KEY && event.newValue === null) {
				setBasket(EMPTY_BASKET)
			}
		}

		window.addEventListener(AUTH_SESSION_CLEARED, clearBasketOnLogout)
		window.addEventListener('storage', clearBasketAcrossTabs)
		return () => {
			window.removeEventListener(
				AUTH_SESSION_CLEARED,
				clearBasketOnLogout,
			)
			window.removeEventListener('storage', clearBasketAcrossTabs)
		}
	}, [])

	return (
		<BasketContext.Provider
			value={{
				basket,
				itemCount: getItemCount(basket),
				total: getBasketTotal(basket),
				limitMessage: getLimitMessage(basket),
				isEmpty: basket.lines.length === 0,
				getQuantity: (menuItemId) =>
					findLine(basket, menuItemId)?.quantity ?? 0,
				getAddBlockedReason: (menuItemId) =>
					getAddBlockedReason(basket, menuItemId),
				isFromOtherRestaurant: (restaurantId) =>
					isFromOtherRestaurant(basket, restaurantId),
				addMenuItem: (restaurant, menuItem) =>
					setBasket((current) =>
						addMenuItem(current, restaurant, menuItem),
					),
				increaseQuantity: (menuItemId) =>
					setBasket((current) =>
						changeQuantity(current, menuItemId, 1),
					),
				decreaseQuantity: (menuItemId) =>
					setBasket((current) =>
						changeQuantity(current, menuItemId, -1),
					),
				removeMenuItem: (menuItemId) =>
					setBasket((current) => removeMenuItem(current, menuItemId)),
				emptyBasket: () => setBasket(EMPTY_BASKET),
			}}
		>
			{children}
		</BasketContext.Provider>
	)
}
