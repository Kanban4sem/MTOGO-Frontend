import messages from '@/features/home-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import styles from '@/features/home-page/TrustedBy/TrustedBy.module.css'

const companies = [
	'Subway',
	'Domino’s',
	'KFC',
	'Burger King',
	'Pizza Hut',
	'McDonald’s',
]

export default function TrustedBy() {
	const t = useTranslations(messages)
	return (
		<section className={styles.section} aria-label={t('trustedByLabel')}>
			<div className={styles.heading}>
				<span>{t('trustedBy')}</span>
			</div>
			<ul className={styles.companies}>
				{companies.map((company) => (
					<li key={company}>{company}</li>
				))}
			</ul>
		</section>
	)
}
