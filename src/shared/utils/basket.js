// The same limits the backend enforces on an order, so a basket can always be placed as one.
export const MAX_BASKET_MENU_ITEMS = 20
export const MAX_QUANTITY = 20

export const EMPTY_BASKET = { restaurant: null, lines: [] }

function isValidLine(line) {
	return (
		line !== null &&
		typeof line === 'object' &&
		Number.isInteger(line.menuItemId) &&
		typeof line.name === 'string' &&
		Number.isFinite(line.price) &&
		line.price >= 0 &&
		Number.isInteger(line.quantity) &&
		line.quantity >= 1 &&
		line.quantity <= MAX_QUANTITY
	)
}

// Stored data may be from an older version or edited by hand, so anything unexpected gives an empty basket.
export function parseStoredBasket(storedValue) {
	try {
		const basket = JSON.parse(storedValue)
		const { restaurant, lines } = basket ?? {}
		if (
			!restaurant ||
			!Number.isInteger(restaurant.id) ||
			typeof restaurant.name !== 'string' ||
			!Array.isArray(lines) ||
			lines.length === 0 ||
			lines.length > MAX_BASKET_MENU_ITEMS ||
			!lines.every(isValidLine) ||
			new Set(lines.map((line) => line.menuItemId)).size !== lines.length
		) {
			return EMPTY_BASKET
		}
		return {
			restaurant: { id: restaurant.id, name: restaurant.name },
			lines: lines.map(({ menuItemId, name, price, quantity }) => ({
				menuItemId,
				name,
				price,
				quantity,
			})),
		}
	} catch {
		return EMPTY_BASKET
	}
}

export function findLine(basket, menuItemId) {
	return basket.lines.find((line) => line.menuItemId === menuItemId)
}

export function isFromOtherRestaurant(basket, restaurantId) {
	return basket.restaurant !== null && basket.restaurant.id !== restaurantId
}

export const ADD_LIMITS = {
	QUANTITY: 'quantity',
	BASKET_FULL: 'basketFull',
}

// The one place that decides whether a menu item can be added, and which limit stops it.
export function getAddLimit(basket, menuItemId) {
	const line = findLine(basket, menuItemId)
	if (line) return line.quantity < MAX_QUANTITY ? null : ADD_LIMITS.QUANTITY
	return basket.lines.length < MAX_BASKET_MENU_ITEMS
		? null
		: ADD_LIMITS.BASKET_FULL
}

export function canAddMenuItem(basket, menuItemId) {
	return getAddLimit(basket, menuItemId) === null
}

export function addMenuItem(basket, restaurant, menuItem) {
	const current = isFromOtherRestaurant(basket, restaurant.id)
		? EMPTY_BASKET
		: basket
	if (!canAddMenuItem(current, menuItem.id)) return current

	if (findLine(current, menuItem.id)) {
		return changeQuantity(current, menuItem.id, 1)
	}
	return {
		restaurant: { id: restaurant.id, name: restaurant.name },
		lines: [
			...current.lines,
			{
				menuItemId: menuItem.id,
				name: menuItem.name,
				price: menuItem.price,
				quantity: 1,
			},
		],
	}
}

// The last removal empties the basket, so an empty basket belongs to no restaurant.
function withLines(basket, lines) {
	return lines.length === 0 ? EMPTY_BASKET : { ...basket, lines }
}

// Lowering a quantity of 1 removes the menu item, and the last removal empties the basket.
export function changeQuantity(basket, menuItemId, change) {
	const lines = basket.lines
		.map((line) =>
			line.menuItemId === menuItemId
				? {
						...line,
						quantity: Math.min(
							line.quantity + change,
							MAX_QUANTITY,
						),
					}
				: line,
		)
		.filter((line) => line.quantity > 0)
	return withLines(basket, lines)
}

export function removeMenuItem(basket, menuItemId) {
	const lines = basket.lines.filter((line) => line.menuItemId !== menuItemId)
	return withLines(basket, lines)
}

export function getItemCount(basket) {
	return basket.lines.reduce((count, line) => count + line.quantity, 0)
}

// Summed in øre, so prices such as 0.1 + 0.2 add up exactly.
export function getBasketTotal(basket) {
	const totalInOre = basket.lines.reduce(
		(total, line) => total + Math.round(line.price * 100) * line.quantity,
		0,
	)
	return totalInOre / 100
}
