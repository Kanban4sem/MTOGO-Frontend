import messages from '@/features/restaurant-profile-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import ProtectedRoute from '@/app/routes/ProtectedRoute.jsx'
import RestaurantProfile from '@/features/restaurant-profile-page/RestaurantProfile/RestaurantProfile.jsx'
import { USER_ROLES } from '@/shared/data/userRoles.js'

export default function RestaurantProfilePage() {
	const t = useTranslations(messages)
	return (
		<>
			<Helmet title={t('businessProfile')} />
			<ProtectedRoute requiredRole={USER_ROLES.RESTAURANT}>
				<RestaurantProfile />
			</ProtectedRoute>
		</>
	)
}
