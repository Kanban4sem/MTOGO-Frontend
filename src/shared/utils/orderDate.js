import { DEFAULT_LANGUAGE, LANGUAGES } from '@/shared/i18n/language.js'

const formatters = Object.fromEntries(
	LANGUAGES.map(({ code, locale }) => [
		code,
		new Intl.DateTimeFormat(locale, {
			dateStyle: 'long',
			timeStyle: 'short',
		}),
	]),
)

export function formatOrderDate(date, language = DEFAULT_LANGUAGE) {
	return formatters[language].format(new Date(date))
}
