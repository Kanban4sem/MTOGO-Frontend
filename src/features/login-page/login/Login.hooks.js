// Pathing
// _______
// src/features/login-page/login/Login.hooks.js

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { getAuthErrorMessage } from '@/shared/utils/authErrors.js'

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
			navigate('/', { replace: true })
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
		registered: state?.registered === true,
		initialEmail: state?.email ?? '',
	}
}
