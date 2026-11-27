import { DEFAULT_LANGUAGE } from '@/shared/i18n/language.js'
import { translate } from '@/shared/i18n/translate.js'
import { withErrorReference } from '@/shared/utils/errorReference.js'
import messages from '@/shared/utils/requestErrors.messages.json'

const STATUS_MESSAGE_KEYS = {
	400: 'rejectedInput',
	403: 'forbidden',
	404: 'noLongerExists',
	409: 'changed',
	422: 'rejectedInput',
}

export function getRequestMessage(error, language = DEFAULT_LANGUAGE) {
	const key = error.isNetworkError
		? 'connectionError'
		: error.status >= 500
			? 'serverError'
			: (STATUS_MESSAGE_KEYS[error.status] ?? 'requestFailed')
	return translate(messages, language, key)
}

export function getRequestErrorMessage(error, language = DEFAULT_LANGUAGE) {
	return withErrorReference(
		getRequestMessage(error, language),
		error,
		language,
	)
}
