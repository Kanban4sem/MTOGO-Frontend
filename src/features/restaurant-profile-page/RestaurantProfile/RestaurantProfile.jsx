import ProfileOverview from '@/shared/components/ProfileOverview/ProfileOverview.jsx'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function RestaurantProfile() {
	const { user } = useAuth()
	return <ProfileOverview title="Virksomhedsprofil" user={user} />
}
