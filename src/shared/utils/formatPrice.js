import { DEFAULT_LANGUAGE, LANGUAGES } from '@/shared/i18n/language.js'

const formatters = Object.fromEntries(
	LANGUAGES.map(({ code, locale }) => [
		code,
		new Intl.NumberFormat(locale, { style: 'currency', currency: 'DKK' }),
	]),
)

export function formatPrice(price, language = DEFAULT_LANGUAGE) {
	return formatters[language].format(price)
}
