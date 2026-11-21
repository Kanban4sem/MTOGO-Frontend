import { Link, matchPath, useLocation } from 'react-router-dom'
import styles from './SubNavBar.module.css'

export function SubNavLinks({ label, links }) {
	const { pathname } = useLocation()

	return (
		<nav className={styles.links} aria-label={label}>
			{links.map(({ to, label }) => (
				<Link
					key={to}
					to={to}
					aria-current={matchPath(to, pathname) ? 'page' : undefined}
				>
					{label}
				</Link>
			))}
		</nav>
	)
}

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
