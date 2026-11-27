import { translate } from '@/shared/i18n/translate.js'
import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import messages from '@/shared/utils/authErrors.messages.json'

const AUTH_MESSAGE_KEYS = {
	400: 'checkAccountDetails',
	401: 'invalidCredentials',
	404: 'authUnavailable',
	409: 'emailAlreadyInUse',
}

export function getAuthErrorMessage(error, language) {
	const key = AUTH_MESSAGE_KEYS[error.status]
	return key
		? translate(messages, language, key)
		: getRequestErrorMessage(error, language)
}
