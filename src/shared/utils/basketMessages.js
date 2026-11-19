import {
	MAX_BASKET_MENU_ITEMS,
	MAX_QUANTITY,
	ADD_LIMITS,
	getAddLimit,
} from '@/shared/utils/basket.js'

// The Danish text about a basket, kept apart from the basket rules in basket.js.
export const BASKET_LIMITS_MESSAGE = `Højst ${MAX_BASKET_MENU_ITEMS} forskellige retter og ${MAX_QUANTITY} stk. af hver.`

export function formatItemCount(itemCount) {
	return `${itemCount} ${itemCount === 1 ? 'vare' : 'varer'}`
}

const ADD_BLOCKED_REASONS = {
	[ADD_LIMITS.QUANTITY]: `Højst ${MAX_QUANTITY} stk.`,
	[ADD_LIMITS.BASKET_FULL]: 'Kurven er fuld',
}

// The short reason next to a disabled add button.
export function getAddBlockedReason(basket, menuItemId) {
	return ADD_BLOCKED_REASONS[getAddLimit(basket, menuItemId)] ?? ''
}

export function getLimitMessage(basket) {
	if (basket.lines.length >= MAX_BASKET_MENU_ITEMS) {
		return `Kurven er fuld. Den kan højst have ${MAX_BASKET_MENU_ITEMS} forskellige retter.`
	}
	if (basket.lines.some((line) => line.quantity >= MAX_QUANTITY)) {
		return `Du kan højst bestille ${MAX_QUANTITY} stk. af hver ret.`
	}
	return ''
}
