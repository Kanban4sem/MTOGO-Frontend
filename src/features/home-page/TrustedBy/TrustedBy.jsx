import styles from './TrustedBy.module.css'

const companies = [
	'nord.',
	'FORMA',
	'studio lune',
	'FÆLLES',
	'goodpeople',
	'ATELIER 06',
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
