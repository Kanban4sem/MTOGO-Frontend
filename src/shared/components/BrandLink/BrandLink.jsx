import { Link } from 'react-router-dom'
import styles from '@/shared/components/BrandLink/BrandLink.module.css'

export default function BrandLink() {
	return (
		<Link className={styles.brand} to="/" aria-label="MTOGO forside">
			<span className={styles.icon} aria-hidden="true">
				m.
			</span>
			MTOGO<span className={styles.dot}>.</span>
		</Link>
	)
}
