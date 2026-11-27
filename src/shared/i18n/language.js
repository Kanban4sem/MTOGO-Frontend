export const DEFAULT_LANGUAGE = 'da'

export const LANGUAGES = [
	{ code: 'da', label: 'Dansk', badge: 'DK', locale: 'da-DK' },
	{ code: 'en', label: 'English', badge: 'EN', locale: 'en-GB' },
]

const STORAGE_KEY = 'mtogo:language'

export function isSupportedLanguage(language) {
	return LANGUAGES.some(({ code }) => code === language)
}

export function readLanguage(storage) {
	try {
		const language = storage().getItem(STORAGE_KEY)
		return isSupportedLanguage(language) ? language : DEFAULT_LANGUAGE
	} catch {
		return DEFAULT_LANGUAGE
	}
}

export function saveLanguage(storage, language) {
	try {
		storage().setItem(STORAGE_KEY, language)
	} catch {
		// The current tab can still use the chosen language when storage is blocked.
	}
}
