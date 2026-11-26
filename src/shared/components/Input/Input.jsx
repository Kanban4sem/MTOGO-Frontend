import { useId } from 'react'
import styles from '@/shared/components/Input/Input.module.css'

function Input({ label, size = 'm', id, className, error, ...options }) {
	const generatedId = useId()
	const inputId = id ?? generatedId
	const errorId = `${inputId}-error`
	const sizeClass = styles[size] ?? styles.m

	return (
		<div className={styles.field}>
			<label className={styles.label} htmlFor={inputId}>
				{label}
			</label>
			<input
				{...options}
				id={inputId}
				className={[styles.input, sizeClass, className]
					.filter(Boolean)
					.join(' ')}
				{...(error && {
					'aria-invalid': true,
					'aria-describedby': errorId,
				})}
			/>
			{error && (
				<p id={errorId} className="visuallyHidden">
					{error}
				</p>
			)}
		</div>
	)
}

export default Input
