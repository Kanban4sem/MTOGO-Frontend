import { Helmet } from 'react-helmet-async'
import RestaurantListing from '@/shared/components/RestaurantListing/RestaurantListing.jsx'

export default function RestaurantsPage() {
	return (
		<>
			<Helmet title="Restauranter" />
			<section
				className="restaurantsPage"
				aria-labelledby="restaurants-title"
			>
				<h1 id="restaurants-title">Restauranter</h1>
				<RestaurantListing />
			</section>
		</>
	)
}
