import styles from './LanguageIndicator.module.css'

function LanguageIndicator() {
	return (
		<span className={styles.indicator} aria-label="Sprog: dansk">
			DK
		</span>
	)
}

export default LanguageIndicator
