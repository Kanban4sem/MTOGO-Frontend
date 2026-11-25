import RestaurantListing from '@/shared/components/RestaurantListing/RestaurantListing.jsx'
import styles from '@/features/home-page/Restaurants/Restaurants.module.css'

export default function Restaurants() {
	return (
		<section
			id="restaurants"
			className={styles.section}
			aria-labelledby="restaurants-title"
		>
			<h2 id="restaurants-title" className={styles.heading}>
				Fremhævede restauranter
			</h2>
			<RestaurantListing limit={2} headingLevel="h3" />
			<div className={styles.banner}>
				<p>Din næste favorit venter lige rundt om hjørnet.</p>
				<span>Velbekomme.</span>
			</div>
		</section>
	)
}
