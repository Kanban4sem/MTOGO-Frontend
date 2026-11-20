import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth.js'
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
	const { state } = useLocation()
	const navigate = useNavigate()
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function handleSubmit(event) {
		event.preventDefault()
		if (isSubmitting) return
		const fields = new FormData(event.currentTarget)
		setError('')
		setIsSubmitting(true)
		try {
			await login({
				email: fields.get('email').trim(),
				password: fields.get('password'),
			})
			navigate(getReturnAddress(state?.returnTo), { replace: true })
		} catch (error) {
			setError(getAuthErrorMessage(error))
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		error,
		isSubmitting,
		handleSubmit,
		// Passed on to register and back, so the user still returns to where they came from.
		returnTo: state?.returnTo,
		registered: state?.registered === true,
		sessionExpired: state?.sessionExpired === true,
		initialEmail: state?.email ?? '',
	}
}
