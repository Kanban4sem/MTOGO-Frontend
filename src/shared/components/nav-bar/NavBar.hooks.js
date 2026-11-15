import { useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth.js'

export function useNavBar() {
	const { isAuthenticated, isLoading, logout } = useAuth()
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const [error, setError] = useState('')

	async function handleLogout() {
		if (isLoggingOut) return
		setError('')
		setIsLoggingOut(true)
		try {
			await logout()
		} catch {
			setError(
				'Du er logget ud her, men vi kunne ikke afslutte sessionen på andre enheder.',
			)
		} finally {
			setIsLoggingOut(false)
		}
	}

	return { isAuthenticated, isLoading, isLoggingOut, error, handleLogout }
}
