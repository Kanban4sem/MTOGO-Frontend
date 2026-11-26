import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useMaintenance } from '@/shared/hooks/useMaintenance.js'
import { useNotification } from '@/shared/hooks/useNotification.js'
import { getAuthErrorMessage } from '@/shared/utils/authErrors.js'

// Only paths inside the app, so a crafted link can't send the user to another site after login.
function getReturnAddress(returnTo) {
	return typeof returnTo === 'string' &&
		returnTo.startsWith('/') &&
		!returnTo.startsWith('//')
		? returnTo
		: '/'
}

export function useLogin() {
	const { login } = useAuth()
	const { state: navigation } = useLocation()
	const navigate = useNavigate()
	const notify = useNotification()
	const { recordPause } = useMaintenance()
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function submitLogin(event) {
		event.preventDefault()
		if (isSubmitting) return
		const fields = new FormData(event.currentTarget)
		setIsSubmitting(true)
		try {
			await login({
				email: fields.get('email').trim(),
				password: fields.get('password'),
			})
			navigate(getReturnAddress(navigation?.returnTo), { replace: true })
		} catch (error) {
			if (!recordPause(error)) notify(getAuthErrorMessage(error), 'error')
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		isSubmitting,
		submitLogin,
		// Passed on to register and back, so the user still returns to where they came from.
		returnTo: navigation?.returnTo,
		sessionExpired: navigation?.sessionExpired === true,
		initialEmail: navigation?.email ?? '',
	}
}
