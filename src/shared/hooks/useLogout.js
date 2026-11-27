import { translate } from '@/shared/i18n/translate.js'
import messages from '@/shared/hooks/useLogout.messages.json'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useNotification } from '@/shared/hooks/useNotification.js'
import { withErrorReference } from '@/shared/utils/errorReference.js'

export function useLogout() {
	const { logout: endSession } = useAuth()
	const notify = useNotification()
	const navigate = useNavigate()
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	async function logout() {
		if (isLoggingOut) return
		setIsLoggingOut(true)
		// Leave first: once the session is cleared, a protected page would send the user to login with itself as the return address.
		navigate('/', { replace: true })
		try {
			await endSession()
			notify(
				(language) => translate(messages, language, 'loggedOut'),
				'success',
			)
		} catch (error) {
			notify(
				(language) =>
					withErrorReference(
						translate(messages, language, 'logoutUnconfirmed'),
						error,
						language,
					),
				'warning',
			)
		} finally {
			setIsLoggingOut(false)
		}
	}

	return { isLoggingOut, logout }
}
