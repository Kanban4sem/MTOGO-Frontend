import { Link } from 'react-router-dom'
import BasketSummary from '@/shared/components/BasketSummary/BasketSummary.jsx'
import { CHECKOUT_PATH } from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { BASKET_LIMITS_MESSAGE } from '@/shared/utils/basketMessages.js'
import styles from './BasketSidePanel.module.css'

export default function BasketSidePanel() {
	const { isEmpty } = useBasket()

	return (
		<aside className={styles.side} aria-labelledby="basket-title">
			<h2 id="basket-title">Din kurv</h2>
			{isEmpty ? (
				<>
					<p className={styles.empty}>
						Din kurv er tom. Læg en ret i kurven for at komme i
						gang.
					</p>
					<p className={styles.empty}>{BASKET_LIMITS_MESSAGE}</p>
				</>
			) : (
				<>
					<BasketSummary
						totalLabel="Kurvens total"
						totalNote="Den endelige ordretotal beregnes, når du bestiller."
					/>
					<Link className={styles.checkout} to={CHECKOUT_PATH}>
						Gå til kassen
					</Link>
				</>
			)}
		</aside>
	)
}
