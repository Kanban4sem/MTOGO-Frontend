import { DEFAULT_LANGUAGE } from '@/shared/i18n/language.js'

export function translate(messages, language, key, values = {}) {
	const message = messages[language]?.[key] ?? messages[DEFAULT_LANGUAGE][key]
	return message.replace(/\{(\w+)\}/g, (placeholder, name) =>
		Object.hasOwn(values, name) ? String(values[name]) : placeholder,
	)
}
