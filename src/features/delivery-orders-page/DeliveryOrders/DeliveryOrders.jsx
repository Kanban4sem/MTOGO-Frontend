import { getOrderStatusName } from '@/shared/data/orderStatus.js'
import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/features/delivery-orders-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import Button from '@/shared/components/Button/Button.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import SubNavBar from '@/shared/components/SubNavBar/SubNavBar.jsx'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import { formatDeliveryAddress } from '@/shared/utils/formatDeliveryAddress.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { useDeliveryOrders } from '@/features/delivery-orders-page/DeliveryOrders/DeliveryOrders.hooks.js'
import styles from '@/features/delivery-orders-page/DeliveryOrders/DeliveryOrders.module.css'

const FILTERS = [
	{ value: 'active', labelKey: 'active' },
	{ value: 'completed', labelKey: 'completed' },
]

const TAKE = { action: 'TAKE', labelKey: 'takeOrder' }
const ASSIGNED_ACTIONS = {
	[ORDER_STATUS.READY]: { action: 'PICK_UP', labelKey: 'markPickedUp' },
	[ORDER_STATUS.PICKED_UP]: {
		action: 'DELIVER',
		labelKey: 'markDelivered',
	},
}

function OrderCard({ order, pendingOrderId, onChange }) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const next = order.assignedToMe ? ASSIGNED_ACTIONS[order.status] : TAKE
	const deliveryAddress =
		formatDeliveryAddress(order.deliveryAddress) ?? t('addressUnavailable')

	return (
		<details className={styles.card}>
			<summary className={styles.summary}>
				<span className={styles.orderTitle}>
					<strong>
						{t('orderNumberLabel')} {order.id}
					</strong>
					<span>{order.restaurantName}</span>
					{!order.assignedToMe && (
						<span>
							{t('deliveringTo')} {deliveryAddress}
						</span>
					)}
				</span>
				<span className={styles.status}>
					{getOrderStatusName(order, language)}
				</span>
				<span className={styles.chevron} aria-hidden="true" />
			</summary>
			<div
				className={styles.details}
				aria-busy={pendingOrderId === order.id}
			>
				{order.assignedToMe && (
					<p>
						<strong>{t('deliveringTo')}</strong> {deliveryAddress}
					</p>
				)}
				<ul className={styles.lines} aria-label={t('orderLines')}>
					{order.lines.map((line) => (
						<li key={line.menuItemId}>
							<span>
								{line.quantity} × {line.name}
							</span>
							<span>{formatPrice(line.subtotal, language)}</span>
						</li>
					))}
				</ul>
				<p className={styles.total}>
					<span>{t('total')}</span>
					<strong>{formatPrice(order.total, language)}</strong>
				</p>
				{next && (
					<Button
						label={t(next.labelKey)}
						aria-label={t('orderAction', {
							label: t(next.labelKey),
							id: order.id,
						})}
						disabled={pendingOrderId !== null}
						onClick={() => onChange(order.id, next.action)}
					/>
				)}
			</div>
		</details>
	)
}

function DeliveryOrderList({
	orders,
	isLoading,
	error,
	emptyTitle,
	pendingOrderId,
	onChange,
}) {
	const t = useTranslations(messages)
	if (isLoading) return <RequestState title={t('loadingOrders')} isLoading />
	if (error) return null
	if (orders.length === 0) return <RequestState title={emptyTitle} />

	return (
		<ul className={styles.orders}>
			{orders.map((order) => (
				<li key={order.id}>
					<OrderCard
						order={order}
						pendingOrderId={pendingOrderId}
						onChange={onChange}
					/>
				</li>
			))}
		</ul>
	)
}

export default function DeliveryOrders({ available }) {
	const t = useTranslations(messages)
	const {
		visibleOrders,
		filter,
		setFilter,
		isLoading,
		error,
		pendingOrderId,
		changeOrder,
		refreshOrders,
	} = useDeliveryOrders(available)
	const emptyTitle = available
		? t('noAvailableOrders')
		: filter === 'completed'
			? t('noCompletedDeliveries')
			: t('noActiveDeliveries')

	return (
		<section
			className={styles.page}
			aria-labelledby="delivery-orders-title"
		>
			<header className={styles.heading}>
				<h1 id="delivery-orders-title">
					{available ? t('availableOrders') : t('orders')}
				</h1>
				<Button
					label={t('refreshOrders')}
					variant="secondary"
					disabled={isLoading || pendingOrderId !== null}
					onClick={refreshOrders}
				/>
			</header>
			{!available && (
				<SubNavBar
					label={t('filterDeliveries')}
					options={FILTERS.map(({ value, labelKey }) => ({
						value,
						label: t(labelKey),
					}))}
					selected={filter}
					onSelect={setFilter}
				/>
			)}
			<DeliveryOrderList
				orders={visibleOrders}
				isLoading={isLoading}
				error={error}
				emptyTitle={emptyTitle}
				pendingOrderId={pendingOrderId}
				onChange={changeOrder}
			/>
		</section>
	)
}
