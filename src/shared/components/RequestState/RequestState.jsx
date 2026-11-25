import styles from '@/shared/components/RequestState/RequestState.module.css'

export default function RequestState({
	title,
	children,
	isLoading = false,
	headingLevel: Heading = 'h2',
	symbol = '↗',
}) {
	return (
		<div
			className={styles.state}
			role="status"
			aria-live="polite"
			aria-busy={isLoading}
		>
			<span className={styles.symbol} aria-hidden="true">
				{isLoading ? '…' : symbol}
			</span>
			<Heading>{title}</Heading>
			{children && <p>{children}</p>}
		</div>
	)
}
