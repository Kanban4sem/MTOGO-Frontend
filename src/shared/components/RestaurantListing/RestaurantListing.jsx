import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/shared/components/RestaurantListing/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import Button from '@/shared/components/Button/Button.jsx'
import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import { useRestaurants } from '@/shared/components/RestaurantListing/RestaurantListing.hooks.js'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { getRestaurantMenuPath } from '@/shared/data/paths.js'
import { useRequestErrorNotification } from '@/shared/hooks/useNotification.js'
import styles from '@/shared/components/RestaurantListing/RestaurantListing.module.css'

export default function RestaurantListing({
	limit,
	headingLevel: Heading = 'h2',
}) {
	const t = useTranslations(messages)
	const { restaurants, isLoading, error, retry } = useRestaurants(limit)
	useRequestErrorNotification(error, (language) =>
		translate(messages, language, 'restaurantsFailed', {
			message: getRequestErrorMessage(error, language),
		}),
	)

	if (isLoading) {
		return <RequestState title={t('loadingRestaurants')} isLoading />
	}
	if (error) {
		return <Button label={t('retryRestaurants')} onClick={retry} />
	}
	if (restaurants.length === 0) {
		return (
			<RequestState title={t('quietKitchen')}>
				{t('noRestaurants')}
			</RequestState>
		)
	}

	return (
		<div className={styles.grid}>
			{restaurants.map((restaurant) => (
				<Link
					key={restaurant.id}
					className={styles.card}
					to={getRestaurantMenuPath(restaurant.id)}
					aria-label={t('seeRestaurantMenu', {
						name: restaurant.name,
					})}
				>
					<div className={styles.imageWrap}>
						<FoodImage
							src={restaurant.preview?.imageUrl}
							alt={restaurant.preview?.name ?? ''}
							loading="lazy"
						/>
					</div>
					<div className={styles.cardContent}>
						<div className={styles.cardDetails}>
							<Heading>{restaurant.name}</Heading>
							<p>
								{restaurant.description ||
									restaurant.preview?.description ||
									t('restaurantListingDescription')}
							</p>
						</div>
						<span className={styles.cardCta}>{t('seeMenu')}</span>
					</div>
				</Link>
			))}
		</div>
	)
}
