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
	return (
		<section
			className={styles.section}
			aria-label="Trusted by – eksempellogoer"
		>
			<div className={styles.heading}>
				<span>TRUSTED BY</span>
			</div>
			<ul className={styles.companies}>
				{companies.map((company) => (
					<li key={company}>{company}</li>
				))}
			</ul>
		</section>
	)
}
