import { useParams } from 'react-router-dom'
import RestaurantMenu from '@/features/restaurant-menu/RestaurantMenu/RestaurantMenu.jsx'

export default function RestaurantMenuPage() {
	const { restaurantId } = useParams()
	return <RestaurantMenu key={restaurantId} restaurantId={restaurantId} />
}
