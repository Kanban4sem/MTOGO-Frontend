import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/shared/components/BasketSummary/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { MAX_QUANTITY } from '@/shared/utils/basket.js'
import { getBasketLimitsMessage } from '@/shared/utils/basketMessages.js'
import styles from '@/shared/components/BasketSummary/BasketSummary.module.css'

export default function BasketSummary({
	totalLabel,
	totalNote,
	disabled = false,
}) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
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
					{t('from')} <strong>{basket.restaurant.name}</strong>
				</p>
			)}
			<ul className={styles.lines}>
				{basket.lines.map((line) => (
					<li key={line.menuItemId} className={styles.line}>
						<div className={styles.lineHeading}>
							<span className={styles.name}>{line.name}</span>
							<span className={styles.subtotal}>
								{formatPrice(
									line.price * line.quantity,
									language,
								)}
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
										? t('removeItem', { name: line.name })
										: t('decreaseQuantity', {
												name: line.name,
											})
								}
							>
								<span aria-hidden="true">−</span>
							</button>
							<span className={styles.quantity}>
								<span className="visuallyHidden">
									{t('quantityLabel')}{' '}
								</span>
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
								aria-label={t('increaseQuantity', {
									name: line.name,
								})}
							>
								<span aria-hidden="true">+</span>
							</button>
							<span className={styles.unitPrice}>
								{t('unitPricePrefix')}{' '}
								{formatPrice(line.price, language)}
							</span>
							<button
								type="button"
								className={styles.remove}
								onClick={() => removeMenuItem(line.menuItemId)}
								disabled={disabled}
								aria-label={t('removeFromBasket', {
									name: line.name,
								})}
							>
								{t('remove')}
							</button>
						</div>
					</li>
				))}
			</ul>
			<div className={styles.total}>
				<span>{totalLabel}</span>
				<strong>{formatPrice(total, language)}</strong>
			</div>
			{totalNote && <p className={styles.note}>{totalNote}</p>}
			<p className={styles.note}>{getBasketLimitsMessage(language)}</p>
		</div>
	)
}
