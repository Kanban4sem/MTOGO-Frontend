import messages from '@/app/pages/RestaurantsPage.messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import RestaurantListing from '@/shared/components/RestaurantListing/RestaurantListing.jsx'

export default function RestaurantsPage() {
	const t = useTranslations(messages)
	return (
		<>
			<Helmet title={t('restaurants')} />
			<section
				className="restaurantsPage"
				aria-labelledby="restaurants-title"
			>
				<h1 id="restaurants-title">{t('restaurants')}</h1>
				<RestaurantListing />
			</section>
		</>
	)
}
