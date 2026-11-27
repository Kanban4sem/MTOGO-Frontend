import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { test } from 'node:test'

const sourceRoot = new URL('../src/', import.meta.url)

registerHooks({
	resolve(specifier, context, nextResolve) {
		const target = specifier.startsWith('@/')
			? new URL(specifier.slice(2), sourceRoot).href
			: specifier
		const resolution = nextResolve(target, context)
		if (resolution.url.endsWith('.json')) {
			return { ...resolution, importAttributes: { type: 'json' } }
		}
		return resolution
	},
})

const { DEFAULT_LANGUAGE, isSupportedLanguage, readLanguage, saveLanguage } =
	await import('../src/shared/i18n/language.js')
const { translate } = await import('../src/shared/i18n/translate.js')
const { getOrderStatusName, ORDER_STATUS } =
	await import('../src/shared/data/orderStatus.js')
const { getCountryName } = await import('../src/shared/data/countries.js')
const { formatPrice } = await import('../src/shared/utils/formatPrice.js')
const { formatOrderDate } = await import('../src/shared/utils/orderDate.js')
const { getRequestErrorMessage } =
	await import('../src/shared/utils/requestErrors.js')
const { getAuthErrorMessage } =
	await import('../src/shared/utils/authErrors.js')
const { formatAddressErrors, validateDeliveryAddress } =
	await import('../src/shared/utils/validateDeliveryAddress.js')
const { formatItemCount, getBasketLimitsMessage } =
	await import('../src/shared/utils/basketMessages.js')

test('language choice defaults to Danish and survives a fresh read', () => {
	const values = new Map()
	const storage = () => ({
		getItem: (key) => values.get(key),
		setItem: (key, value) => values.set(key, value),
	})

	assert.equal(DEFAULT_LANGUAGE, 'da')
	assert.equal(readLanguage(storage), 'da')
	assert.equal(isSupportedLanguage('en'), true)
	assert.equal(isSupportedLanguage('fr'), false)
	saveLanguage(storage, 'en')
	assert.equal(readLanguage(storage), 'en')
	saveLanguage(storage, 'da')
	assert.equal(readLanguage(storage), 'da')
	values.set('mtogo:language', 'fr')
	assert.equal(readLanguage(storage), 'da')
})

test('blocked browser storage still allows Danish to render', () => {
	function blockedStorage() {
		throw new Error('Browser storage blocked')
	}

	assert.equal(readLanguage(blockedStorage), 'da')
	assert.doesNotThrow(() => saveLanguage(blockedStorage, 'en'))
})

test('all catalogs have matching message keys and placeholders', () => {
	const files = readdirSync(sourceRoot, { recursive: true }).filter((file) =>
		/(?:^|[./\\])messages\.json$/.test(file),
	)
	assert.ok(files.length > 0)

	for (const file of files) {
		const { da, en } = JSON.parse(readFileSync(new URL(file, sourceRoot)))
		assert.deepEqual(Object.keys(en).sort(), Object.keys(da).sort(), file)
		for (const [key, message] of Object.entries(da)) {
			assert.ok(message.trim() && en[key].trim(), `${file} ${key}`)
			assert.deepEqual(
				(en[key].match(/\{\w+\}/g) ?? []).sort(),
				(message.match(/\{\w+\}/g) ?? []).sort(),
				`${file} ${key}`,
			)
		}
	}
})

test('interpolation keeps values intact and falls back to Danish', () => {
	const messages = {
		da: { order: 'Ordre {id}: {name}', retry: 'Prøv igen' },
		en: { order: 'Order {id}: {name}' },
	}
	assert.equal(
		translate(messages, 'en', 'order', { id: 12, name: 'A {name}' }),
		'Order 12: A {name}',
	)
	assert.equal(translate(messages, 'en', 'retry'), 'Prøv igen')
})

test('orders use the API status name from the active language', () => {
	const order = {
		status: ORDER_STATUS.READY,
		statusName: {
			danish: 'Klar til afhentning',
			english: 'Ready for collection',
		},
	}
	assert.equal(getOrderStatusName(order, 'da'), 'Klar til afhentning')
	assert.equal(getOrderStatusName(order, 'en'), 'Ready for collection')
})

test('older orders use the status code when the selected status name is missing', () => {
	const order = {
		status: ORDER_STATUS.PLACED,
		statusName: { danish: 'Bestilt' },
	}
	assert.equal(getOrderStatusName(order, 'en'), 'Placed')
	assert.equal(
		getOrderStatusName({ ...order, statusName: 'Bestilt' }, 'en'),
		'Placed',
	)
	assert.equal(
		getOrderStatusName({ status: ORDER_STATUS.READY }, 'da'),
		'Klar til afhentning',
	)
	assert.equal(
		getOrderStatusName({ statusName: { danish: 'Ældre status' } }, 'en'),
		'Ældre status',
	)
	assert.equal(getOrderStatusName({}, 'en'), '')
})

test('prices, dates and the delivery country follow the selected language', () => {
	assert.match(formatPrice(42.5, 'da'), /42,50\s*kr\./)
	assert.match(formatPrice(42.5, 'en'), /DKK\s*42\.50/)
	const date = '2026-11-27T12:00:00'
	assert.match(formatOrderDate(date, 'da'), /27\. november 2026/)
	assert.match(formatOrderDate(date, 'en'), /27 November 2026/)
	assert.equal(getCountryName('Denmark', 'da'), 'Danmark')
	assert.equal(getCountryName('Denmark', 'en'), 'Denmark')
})

test('API errors retain their localized reference and hide server details', () => {
	const error = {
		status: 500,
		data: { errorId: 'ABC123', detail: 'Internal' },
	}
	assert.equal(
		getRequestErrorMessage(error, 'da'),
		'Der opstod en serverfejl. Prøv igen senere. Fejlreference: ABC123',
	)
	assert.equal(
		getRequestErrorMessage(error, 'en'),
		'A server error occurred. Please try again later. Error reference: ABC123',
	)
	assert.doesNotMatch(
		getRequestErrorMessage({ ...error, status: 403 }, 'en'),
		/Internal|ABC123/,
	)
	assert.match(
		getRequestErrorMessage({ isNetworkError: true }, 'en'),
		/connect/,
	)
	assert.match(
		getAuthErrorMessage({ status: 401 }, 'en'),
		/password is incorrect/,
	)
})

test('address validation and basket messages render in both languages', () => {
	const errors = validateDeliveryAddress({
		street: '',
		postalCode: '123',
		city: 'a'.repeat(101),
	})
	assert.equal(
		formatAddressErrors(errors, 'da'),
		'Skriv vej og husnummer. Postnummeret skal være præcis 4 cifre. Byen må højst være 100 tegn.',
	)
	assert.equal(
		formatAddressErrors(errors, 'en'),
		'Enter a street and house number. The postal code must be exactly 4 digits. The city must be at most 100 characters.',
	)
	assert.equal(formatItemCount(1, 'da'), '1 vare')
	assert.equal(formatItemCount(2, 'da'), '2 varer')
	assert.equal(formatItemCount(1, 'en'), '1 item')
	assert.equal(formatItemCount(2, 'en'), '2 items')
	assert.match(getBasketLimitsMessage('en'), /20 different dishes and 20/)
})
