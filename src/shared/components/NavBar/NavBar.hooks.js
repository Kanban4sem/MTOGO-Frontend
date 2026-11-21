import { useState } from 'react'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'

export function useNavBar() {
	const { user, isAuthenticated, isLoading, logout } = useAuth()
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

	return {
		isAuthenticated,
		isCustomer: user?.role === USER_ROLES.CUSTOMER,
		isRestaurant: user?.role === USER_ROLES.RESTAURANT,
		isDeliveryAgent: user?.role === USER_ROLES.DELIVERY_AGENT,
		isLoading,
		isLoggingOut,
		error,
		handleLogout,
	}
}
