import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import { getOrderStatusName } from '@/shared/data/orderStatus.js'
import { useLanguage } from '@/shared/i18n/useLanguage.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/order-confirmation-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import Button from '@/shared/components/Button/Button.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { getCountryName } from '@/shared/data/countries.js'
import { formatDeliveryAddress } from '@/shared/utils/formatDeliveryAddress.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { useRequestErrorNotification } from '@/shared/hooks/useNotification.js'
import { isOrderNotFound } from '@/shared/utils/orderErrors.js'
import { useOrderConfirmation } from '@/features/order-confirmation-page/OrderConfirmation/OrderConfirmation.hooks.js'
import styles from '@/features/order-confirmation-page/OrderConfirmation/OrderConfirmation.module.css'

export default function OrderConfirmation({ orderId }) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const {
		isLoading,
		data: order,
		error,
		reload,
	} = useOrderConfirmation(orderId)
	const orderNotFound = error && isOrderNotFound(error)
	useRequestErrorNotification(error, (language) =>
		orderNotFound
			? translate(messages, language, 'orderNotFoundNotice')
			: translate(messages, language, 'confirmationFailed', {
					orderId,
					message: getRequestErrorMessage(error, language),
				}),
	)

	if (isLoading) {
		return <RequestState title={t('loadingYourOrder')} isLoading />
	}
	if (error) {
		if (orderNotFound) {
			return <RequestState title={t('orderNotFound')} />
		}
		// Checkout has already emptied the basket, so keep the order number in view and let the customer retry.
		return (
			<RequestState title={t('orderNumber', { orderId })}>
				<Button label={t('retry')} onClick={reload} />
			</RequestState>
		)
	}

	const { deliveryAddress } = order
	const statusName = getOrderStatusName(order, language)

	return (
		<section
			className={styles.confirmation}
			aria-labelledby="confirmation-title"
		>
			<header className={styles.intro}>
				{statusName && (
					<p className={styles.status}>
						{t('statusLabel')} <strong>{statusName}</strong>
					</p>
				)}
				<h1 id="confirmation-title">{t('thanksForOrdering')}</h1>
				<p>
					{t('yourOrderNumber')} <strong>{order.id}</strong>.
				</p>
			</header>
			<div className={styles.details}>
				<section className={styles.card} aria-labelledby="order-lines">
					<h2 id="order-lines">{t('yourOrder')}</h2>
					<table className={styles.lines}>
						<thead>
							<tr>
								<th scope="col">{t('dish')}</th>
								<th scope="col">{t('price')}</th>
								<th scope="col">{t('quantity')}</th>
								<th scope="col">{t('total')}</th>
							</tr>
						</thead>
						<tbody>
							{order.lines.map((line) => (
								<tr key={line.menuItemId}>
									<th scope="row">{line.name}</th>
									<td data-label={t('price')}>
										{formatPrice(line.unitPrice, language)}
									</td>
									<td data-label={t('quantity')}>
										{line.quantity}
									</td>
									<td data-label={t('total')}>
										{formatPrice(line.subtotal, language)}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<th scope="row" colSpan={3}>
									{t('orderTotal')}
								</th>
								<td>{formatPrice(order.total, language)}</td>
							</tr>
						</tfoot>
					</table>
				</section>
				<section
					className={styles.card}
					aria-labelledby="order-address"
				>
					<h2 id="order-address">{t('deliveryAddress')}</h2>
					<address className={styles.address}>
						{formatDeliveryAddress(deliveryAddress, '\n')}
						<br />
						{getCountryName(deliveryAddress.country, language)}
					</address>
				</section>
			</div>
			<Link className={styles.home} to="/">
				{t('goHome')}
			</Link>
		</section>
	)
}
