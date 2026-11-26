import { useBasket } from '@/shared/hooks/useBasket.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { MAX_QUANTITY } from '@/shared/utils/basket.js'
import { BASKET_LIMITS_MESSAGE } from '@/shared/utils/basketMessages.js'
import styles from '@/shared/components/BasketSummary/BasketSummary.module.css'

export default function BasketSummary({
	totalLabel,
	totalNote,
	disabled = false,
}) {
	const {
		basket,
		total,
		increaseQuantity,
		decreaseQuantity,
		removeMenuItem,
	} = useBasket()

	return (
		<div className={styles.summary}>
			{basket.restaurant && (
				<p className={styles.restaurant}>
					Fra <strong>{basket.restaurant.name}</strong>
				</p>
			)}
			<ul className={styles.lines}>
				{basket.lines.map((line) => (
					<li key={line.menuItemId} className={styles.line}>
						<div className={styles.lineHeading}>
							<span className={styles.name}>{line.name}</span>
							<span className={styles.subtotal}>
								{formatPrice(line.price * line.quantity)}
							</span>
						</div>
						<div className={styles.controls}>
							<button
								type="button"
								className={styles.step}
								onClick={() =>
									decreaseQuantity(line.menuItemId)
								}
								disabled={disabled}
								aria-label={
									line.quantity === 1
										? `Fjern ${line.name}`
										: `Færre ${line.name}`
								}
							>
								<span aria-hidden="true">−</span>
							</button>
							<span className={styles.quantity}>
								<span className="visuallyHidden">Antal: </span>
								{line.quantity}
							</span>
							<button
								type="button"
								className={styles.step}
								onClick={() =>
									increaseQuantity(line.menuItemId)
								}
								disabled={
									disabled || line.quantity >= MAX_QUANTITY
								}
								aria-label={`Flere ${line.name}`}
							>
								<span aria-hidden="true">+</span>
							</button>
							<span className={styles.unitPrice}>
								à {formatPrice(line.price)}
							</span>
							<button
								type="button"
								className={styles.remove}
								onClick={() => removeMenuItem(line.menuItemId)}
								disabled={disabled}
								aria-label={`Fjern ${line.name} fra kurven`}
							>
								Fjern
							</button>
						</div>
					</li>
				))}
			</ul>
			<div className={styles.total}>
				<span>{totalLabel}</span>
				<strong>{formatPrice(total)}</strong>
			</div>
			{totalNote && <p className={styles.note}>{totalNote}</p>}
			<p className={styles.note}>{BASKET_LIMITS_MESSAGE}</p>
		</div>
	)
}
