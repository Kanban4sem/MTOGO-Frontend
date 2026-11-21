import { Link } from 'react-router-dom'
import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { getRestaurantMenuPath } from '@/shared/data/paths.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { useRestaurants } from './Restaurants.hooks.js'
import styles from './Restaurants.module.css'

export default function Restaurants() {
	const { restaurants, isLoading, error } = useRestaurants()

	return (
		<section
			id="restaurants"
			className={styles.section}
			aria-labelledby="restaurants-title"
		>
			<div className={styles.heading}>
				<div>
					<h2 id="restaurants-title">Hvad har du lyst til?</h2>
				</div>
			</div>
			{isLoading ? (
				<RequestState
					title="Vi finder restauranterne frem…"
					isLoading
				/>
			) : error ? (
				<RequestState title="Vi kunne ikke hente restauranterne">
					Prøv at genindlæse siden om lidt.{' '}
					<a href="/#restaurants">Prøv igen</a>
				</RequestState>
			) : restaurants.length === 0 ? (
				<RequestState title="Der er lidt stille i køkkenet">
					Ingen restauranter tager imod bestillinger lige nu. Kig
					forbi igen senere.
				</RequestState>
			) : (
				<div className={styles.grid}>
					{restaurants.map((restaurant) => (
						<Link
							key={restaurant.id}
							className={styles.card}
							to={getRestaurantMenuPath(restaurant.id)}
						>
							<div className={styles.imageWrap}>
								<FoodImage
									src={restaurant.preview?.imageUrl}
									alt={
										restaurant.preview?.name ??
										restaurant.name
									}
									loading="lazy"
								/>
							</div>
							<div className={styles.cardContent}>
								<div className={styles.cardHeading}>
									<h3>{restaurant.name}</h3>
								</div>
								<p>
									{restaurant.preview?.description ||
										'Se restaurantens menu og find din næste favorit.'}
								</p>
								<div className={styles.cardFooter}>
									<span>Se menuen</span>
									{restaurant.preview && (
										<span>
											{restaurant.preview.name} ·{' '}
											{formatPrice(
												restaurant.preview.price,
											)}
										</span>
									)}
								</div>
							</div>
						</Link>
					))}
				</div>
			)}
			<div className={styles.banner}>
				<p>Din næste favorit venter lige rundt om hjørnet.</p>
				<span>Velbekomme.</span>
			</div>
		</section>
	)
}
