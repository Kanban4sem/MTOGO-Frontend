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
	const { restaurants, isLoading, error, retry } = useRestaurants(limit)
	useRequestErrorNotification(
		error,
		error && `Vi kunne ikke hente restauranterne. ${error.message}`,
	)

	if (isLoading) {
		return <RequestState title="Vi finder restauranterne frem…" isLoading />
	}
	if (error) {
		return <Button label="Hent restauranter igen" onClick={retry} />
	}
	if (restaurants.length === 0) {
		return (
			<RequestState title="Der er lidt stille i køkkenet">
				Ingen restauranter tager imod bestillinger lige nu. Kig forbi
				igen senere.
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
					aria-label={`Se udvalg hos ${restaurant.name}`}
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
									'Se restaurantens menu og find din næste favorit.'}
							</p>
						</div>
						<span className={styles.cardCta}>Se udvalg</span>
					</div>
				</Link>
			))}
		</div>
	)
}
