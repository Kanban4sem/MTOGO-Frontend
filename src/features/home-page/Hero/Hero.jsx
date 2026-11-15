import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import styles from './Hero.module.css'

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
				<a className={styles.cta} href="#restaurants">
					Udforsk restauranter <span aria-hidden="true">↗</span>
				</a>
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
