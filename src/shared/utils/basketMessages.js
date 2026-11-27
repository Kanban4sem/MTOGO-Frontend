import {
	MAX_BASKET_MENU_ITEMS,
	MAX_QUANTITY,
	ADD_LIMITS,
	getAddLimit,
} from '@/shared/utils/basket.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/shared/utils/basketMessages.messages.json'

const LIMITS = { maxItems: MAX_BASKET_MENU_ITEMS, maxQuantity: MAX_QUANTITY }

export function getBasketLimitsMessage(language) {
	return translate(messages, language, 'basketLimits', LIMITS)
}

export function formatItemCount(count, language) {
	return translate(
		messages,
		language,
		count === 1 ? 'oneItem' : 'manyItems',
		{ count },
	)
}

const ADD_BLOCKED_KEYS = {
	[ADD_LIMITS.QUANTITY]: 'quantityLimit',
	[ADD_LIMITS.BASKET_FULL]: 'basketFull',
}

export function getAddBlockedReason(basket, menuItemId, language) {
	const key = ADD_BLOCKED_KEYS[getAddLimit(basket, menuItemId)]
	return key ? translate(messages, language, key, LIMITS) : ''
}

export function getBasketLimitMessageKey(basket) {
	if (basket.lines.length >= MAX_BASKET_MENU_ITEMS) return 'basketFullDetails'
	if (basket.lines.some((line) => line.quantity >= MAX_QUANTITY))
		return 'quantityLimitDetails'
	return null
}

export function formatBasketLimit(key, language) {
	return translate(messages, language, key, LIMITS)
}
