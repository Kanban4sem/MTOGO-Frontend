import messages from '@/features/home-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import { RESTAURANTS_PATH } from '@/shared/data/paths.js'
import styles from '@/features/home-page/Hero/Hero.module.css'

export default function Hero() {
	const t = useTranslations(messages)
	return (
		<section className={styles.hero} aria-labelledby="hero-title">
			<div className={styles.content}>
				<h1 id="hero-title">
					{t('goodFood')}
					<br />
					{t('rightTo')} <span>{t('yourDoor')}</span>
				</h1>
				<p className={styles.description}>{t('heroDescription')}</p>
				<Link className={styles.cta} to={RESTAURANTS_PATH}>
					{t('exploreRestaurants')}
					<span className="chevron" aria-hidden="true" />
				</Link>
			</div>
			<div className={styles.visual}>
				<FoodImage
					src="/images/restaurant/menu/restaurant-1-item-1.png"
					alt={t('heroImage')}
					fetchPriority="high"
				/>
			</div>
		</section>
	)
}
