import { DEFAULT_LANGUAGE } from '@/shared/i18n/language.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/shared/utils/errorReference.messages.json'

// Only a 5xx carries an errorId, which finds the entry in the backend's log.
export function errorReference(error, language = DEFAULT_LANGUAGE) {
	const errorId = error?.status >= 500 ? error.data?.errorId : undefined
	return errorId
		? translate(messages, language, 'errorReference', { errorId })
		: ''
}

export function withErrorReference(text, error, language) {
	return [text, errorReference(error, language)].filter(Boolean).join(' ')
}
