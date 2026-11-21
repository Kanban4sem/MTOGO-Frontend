import styles from './SubNavBar.module.css'

export default function SubNavBar({ label, options, selected, onSelect }) {
	return (
		<div className={styles.options} role="group" aria-label={label}>
			{options.map(({ value, label }) => (
				<button
					key={value}
					type="button"
					aria-pressed={value === selected}
					onClick={() => onSelect(value)}
				>
					{label}
				</button>
			))}
		</div>
	)
}
