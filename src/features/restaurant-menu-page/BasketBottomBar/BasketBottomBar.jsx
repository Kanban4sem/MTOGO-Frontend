import { Link } from 'react-router-dom'
import { CHECKOUT_PATH } from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import {
	BASKET_LIMITS_MESSAGE,
	formatItemCount,
} from '@/shared/utils/basketMessages.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import styles from '@/features/restaurant-menu-page/BasketBottomBar/BasketBottomBar.module.css'

export default function BasketBottomBar() {
	const { isEmpty, itemCount, total, limitMessage } = useBasket()

	return (
		<div className={styles.bottom}>
			<p className={styles.limit} role="status">
				{limitMessage}
			</p>
			{!isEmpty && (
				<>
					{!limitMessage && (
						<p className={styles.limits}>{BASKET_LIMITS_MESSAGE}</p>
					)}
					<Link className={styles.bar} to={CHECKOUT_PATH}>
						<span>
							{formatItemCount(itemCount)} · {formatPrice(total)}
						</span>
						<span>
							Gå til kassen <span aria-hidden="true">→</span>
						</span>
					</Link>
				</>
			)}
		</div>
	)
}
