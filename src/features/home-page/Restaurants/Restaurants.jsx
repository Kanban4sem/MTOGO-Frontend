import messages from '@/features/home-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import RestaurantListing from '@/shared/components/RestaurantListing/RestaurantListing.jsx'
import styles from '@/features/home-page/Restaurants/Restaurants.module.css'

export default function Restaurants() {
	const t = useTranslations(messages)
	return (
		<section
			id="restaurants"
			className={styles.section}
			aria-labelledby="restaurants-title"
		>
			<h2 id="restaurants-title" className={styles.heading}>
				{t('featuredRestaurants')}
			</h2>
			<RestaurantListing limit={2} headingLevel="h3" />
			<div className={styles.banner}>
				<p>{t('featuredDescription')}</p>
				<span>{t('enjoyYourMeal')}</span>
			</div>
		</section>
	)
}
