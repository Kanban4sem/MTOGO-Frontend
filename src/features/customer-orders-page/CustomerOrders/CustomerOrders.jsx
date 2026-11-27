import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import { translate } from '@/shared/i18n/translate.js'
import { getOrderStatusName } from '@/shared/data/orderStatus.js'
import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/features/customer-orders-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import OrderFeedback from '@/features/customer-orders-page/OrderFeedback/OrderFeedback.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import {
	CUSTOMER_ORDERS_PATH,
	getCustomerOrderPath,
} from '@/shared/data/paths.js'
import { formatDeliveryAddress } from '@/shared/utils/formatDeliveryAddress.js'
import { formatOrderDate } from '@/shared/utils/orderDate.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { useRequestErrorNotification } from '@/shared/hooks/useNotification.js'
import { isOrderNotFound } from '@/shared/utils/orderErrors.js'
import { useCustomerOrders } from '@/features/customer-orders-page/CustomerOrders/CustomerOrders.hooks.js'
import styles from '@/features/customer-orders-page/CustomerOrders/CustomerOrders.module.css'

function OrderStatus({ order }) {
	const { language } = useLanguage()
	return (
		<span className={styles.orderStatus}>
			{getOrderStatusName(order, language)}
		</span>
	)
}

function OrderList({ orders }) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	if (orders.length === 0) {
		return <RequestState title={t('noOrders')} />
	}

	return (
		<ul className={styles.orders}>
			{orders.map((order) => (
				<li key={order.id}>
					<Link
						to={getCustomerOrderPath(order.id)}
						className={styles.orderLink}
					>
						<strong>
							{t('orderNumberLabel')} {order.id}
						</strong>
						<OrderStatus order={order} />
						<span>{formatPrice(order.total, language)}</span>
						<span className={styles.deliveryAddress}>
							{formatDeliveryAddress(order.deliveryAddress) ??
								t('addressUnavailable')}
						</span>
					</Link>
				</li>
			))}
		</ul>
	)
}

function OrderDetails({ order }) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	return (
		<>
			<p className={styles.orderMeta}>
				<OrderStatus order={order} />
				<time dateTime={order.placedAt}>
					{formatOrderDate(order.placedAt, language)}
				</time>
			</p>
			<p className={styles.deliveryAddress}>
				<strong>{t('deliveryAddressLabel')}</strong>{' '}
				{formatDeliveryAddress(order.deliveryAddress) ??
					t('addressUnavailable')}
			</p>
			<section className={styles.receipt} aria-labelledby="order-lines">
				<h2 id="order-lines">{t('orderLines')}</h2>
				<ul className={styles.lines}>
					{order.lines.map((line) => (
						<li key={line.menuItemId}>
							<div>
								<strong>{line.name}</strong>
								<p>
									{line.quantity} {t('pricePerItem')}{' '}
									{formatPrice(line.unitPrice, language)}
								</p>
							</div>
							<span>{formatPrice(line.subtotal, language)}</span>
						</li>
					))}
				</ul>
				<p className={styles.total}>
					<span>{t('total')}</span>
					<strong>{formatPrice(order.total, language)}</strong>
				</p>
			</section>
			{order.status === ORDER_STATUS.DELIVERED && (
				<OrderFeedback orderId={order.id} />
			)}
		</>
	)
}

function OrderContent({ orderId }) {
	const t = useTranslations(messages)
	const { isLoading, data, error, reload } = useCustomerOrders(orderId)
	const orderNotFound =
		orderId !== undefined && error && isOrderNotFound(error)
	useRequestErrorNotification(error, (language) =>
		orderNotFound
			? translate(messages, language, 'orderNotFoundNotice')
			: translate(messages, language, 'customerOrdersFailed', {
					message: getRequestErrorMessage(error, language),
				}),
	)

	if (isLoading) {
		return <RequestState title={t('loadingOrders')} isLoading />
	}
	if (error) {
		if (orderNotFound) {
			return <RequestState title={t('orderNotFound')} />
		}
		return <Button label={t('retry')} onClick={reload} />
	}
	if (orderId === undefined) return <OrderList orders={data} />
	return <OrderDetails order={data} />
}

export default function CustomerOrders({ orderId }) {
	const t = useTranslations(messages)
	return (
		<section
			className={styles.page}
			aria-labelledby="customer-orders-title"
		>
			{orderId !== undefined && (
				<Link to={CUSTOMER_ORDERS_PATH}>{t('backToMyOrders')}</Link>
			)}
			<h1 id="customer-orders-title">
				{orderId === undefined
					? t('myOrders')
					: t('orderNumber', { orderId })}
			</h1>
			<OrderContent orderId={orderId} />
		</section>
	)
}
