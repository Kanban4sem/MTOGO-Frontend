// Pathing
// _______
// src/shared/components/Button/Button.jsx

import styles from './Button.module.css'

function Button({ label, size = 'm', type = 'button', className, ...options }) {
	const sizeClass = styles[size] ?? styles.m

	return (
		<button
			{...options}
			type={type}
			className={[styles.button, sizeClass, className]
				.filter(Boolean)
				.join(' ')}
		>
			{label}
		</button>
	)
}

export default Button
