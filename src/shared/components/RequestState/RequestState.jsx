import styles from './RequestState.module.css'

export default function RequestState({ title, children, isLoading = false }) {
	return (
		<div
			className={styles.state}
			role="status"
			aria-live="polite"
			aria-busy={isLoading}
		>
			<span className={styles.symbol} aria-hidden="true">
				{isLoading ? '…' : '↗'}
			</span>
			<h2>{title}</h2>
			{children && <p>{children}</p>}
		</div>
	)
}
