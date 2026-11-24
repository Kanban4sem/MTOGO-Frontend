import styles from '@/shared/components/Button/Button.module.css'

function Button({
	label,
	size = 'm',
	variant = 'primary',
	type = 'button',
	className,
	...options
}) {
	const sizeClass = styles[size] ?? styles.m
	const variantClass = variant === 'secondary' ? styles.secondary : null

	return (
		<button
			{...options}
			type={type}
			className={[styles.button, sizeClass, variantClass, className]
				.filter(Boolean)
				.join(' ')}
		>
			{label}
		</button>
	)
}

export default Button
