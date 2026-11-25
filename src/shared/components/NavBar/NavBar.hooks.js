import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useLogout } from '@/shared/hooks/useLogout.js'

export function useNavBar() {
	const { user, isAuthenticated, isLoading } = useAuth()
	const isCustomer = user?.role === USER_ROLES.CUSTOMER
	const { isLoggingOut, error, logout } = useLogout()

	return {
		isAuthenticated,
		isCustomer,
		customerId: isCustomer ? user.id : null,
		isRestaurant: user?.role === USER_ROLES.RESTAURANT,
		isDeliveryAgent: user?.role === USER_ROLES.DELIVERY_AGENT,
		isLoading,
		isLoggingOut,
		error,
		logout,
	}
}
