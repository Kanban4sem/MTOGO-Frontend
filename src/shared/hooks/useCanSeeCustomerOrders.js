import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

// The orders page is for customers and sits behind the ordering flag, so every link to it follows both.
export function useCanSeeCustomerOrders() {
	const { user } = useAuth()
	const { isEnabled } = useFeatureFlags()

	return user?.role === USER_ROLES.CUSTOMER && isEnabled('orderingEnabled')
}
