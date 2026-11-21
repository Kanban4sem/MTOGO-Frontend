import { Helmet } from 'react-helmet-async'
import Hero from '@/features/home-page/Hero/Hero.jsx'
import TrustedBy from '@/features/home-page/TrustedBy/TrustedBy.jsx'
import Restaurants from '@/features/home-page/Restaurants/Restaurants.jsx'

export default function HomePage() {
	return (
		<>
			<Helmet title="Forside" />
			<Hero />
			<TrustedBy />
			<Restaurants />
		</>
	)
}
