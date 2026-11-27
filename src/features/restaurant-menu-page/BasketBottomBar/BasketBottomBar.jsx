import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/features/restaurant-menu-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { CHECKOUT_PATH } from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import {
	getBasketLimitsMessage,
	formatItemCount,
} from '@/shared/utils/basketMessages.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import styles from '@/features/restaurant-menu-page/BasketBottomBar/BasketBottomBar.module.css'

export default function BasketBottomBar() {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const { isEmpty, itemCount, total } = useBasket()
	const bottomBar = useRef(null)

	useLayoutEffect(() => {
		if (isEmpty) return

		const bar = bottomBar.current
		const page = document.documentElement
		const heightProperty = '--mtogo-bottom-bar-height'
		function reserveBottomSpace() {
			page.style.setProperty(heightProperty, `${bar.offsetHeight}px`)
		}

		reserveBottomSpace()
		const observer = new ResizeObserver(reserveBottomSpace)
		observer.observe(bar, { box: 'border-box' })

		return () => {
			observer.disconnect()
			page.style.removeProperty(heightProperty)
		}
	}, [isEmpty])

	return (
		<div ref={bottomBar} className={styles.bottom}>
			{!isEmpty && (
				<>
					<p className={styles.limits}>
						{getBasketLimitsMessage(language)}
					</p>
					<Link className={styles.bar} to={CHECKOUT_PATH}>
						<span>
							{formatItemCount(itemCount, language)} ·{' '}
							{formatPrice(total, language)}
						</span>
						<span>
							{t('goToCheckout')}{' '}
							<span aria-hidden="true">→</span>
						</span>
					</Link>
				</>
			)}
		</div>
	)
}
