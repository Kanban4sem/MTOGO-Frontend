import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth.js'

export function useLogout() {
	const { logout: endSession } = useAuth()
	const navigate = useNavigate()
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const [error, setError] = useState('')

	async function logout() {
		if (isLoggingOut) return
		setError('')
		setIsLoggingOut(true)
		// Leave first: once the session is cleared, a protected page would send the user to login with itself as the return address.
		navigate('/', { replace: true })
		try {
			await endSession()
		} catch {
			// AuthProvider clears the local session even if the server cannot revoke it.
			setError(
				'Du er logget ud her, men vi kunne ikke afslutte sessionen på andre enheder.',
			)
		} finally {
			setIsLoggingOut(false)
		}
	}

	return { isLoggingOut, error, logout }
}
