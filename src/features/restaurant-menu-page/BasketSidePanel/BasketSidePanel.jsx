import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/features/restaurant-menu-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import BasketSummary from '@/shared/components/BasketSummary/BasketSummary.jsx'
import { CHECKOUT_PATH } from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { getBasketLimitsMessage } from '@/shared/utils/basketMessages.js'
import styles from '@/features/restaurant-menu-page/BasketSidePanel/BasketSidePanel.module.css'

export default function BasketSidePanel() {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const { isEmpty } = useBasket()

	return (
		<aside className={styles.side} aria-labelledby="basket-title">
			<h2 id="basket-title">{t('yourBasket')}</h2>
			{isEmpty ? (
				<>
					<p className={styles.empty}>{t('emptyBasketHelp')}</p>
					<p className={styles.empty}>
						{getBasketLimitsMessage(language)}
					</p>
				</>
			) : (
				<>
					<BasketSummary
						totalLabel={t('basketTotal')}
						totalNote={t('finalBasketTotal')}
					/>
					<Link className={styles.checkout} to={CHECKOUT_PATH}>
						{t('goToCheckout')}
					</Link>
				</>
			)}
		</aside>
	)
}
