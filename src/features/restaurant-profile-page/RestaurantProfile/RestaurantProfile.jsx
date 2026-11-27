import messages from '@/features/restaurant-profile-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import ProfileOverview from '@/shared/components/ProfileOverview/ProfileOverview.jsx'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function RestaurantProfile() {
	const t = useTranslations(messages)
	const { user } = useAuth()
	return <ProfileOverview title={t('businessProfile')} user={user} />
}
