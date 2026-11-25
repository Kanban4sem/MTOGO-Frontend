import { Link } from 'react-router-dom'
import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import { RESTAURANTS_PATH } from '@/shared/data/paths.js'
import styles from '@/features/home-page/Hero/Hero.module.css'

export default function Hero() {
	return (
		<section className={styles.hero} aria-labelledby="hero-title">
			<div className={styles.content}>
				<h1 id="hero-title">
					God mad.
					<br />
					Lige til <span>døren.</span>
				</h1>
				<p className={styles.description}>
					Fra den første sprøde bid til din nye yndlingsret. Find
					noget, du har lyst til, hos vores restauranter.
				</p>
				<Link className={styles.cta} to={RESTAURANTS_PATH}>
					Udforsk restauranter
					<span className="chevron" aria-hidden="true" />
				</Link>
			</div>
			<div className={styles.visual}>
				<FoodImage
					src="/images/restaurant/menu/restaurant-1-item-1.png"
					alt="Kebab med sprød salat, pommes frites og sodavand"
					fetchPriority="high"
				/>
			</div>
		</section>
	)
}
