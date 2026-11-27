import { getOrderStatusName } from '@/shared/data/orderStatus.js'
import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/features/restaurant-orders-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useState } from 'react'
import Button from '@/shared/components/Button/Button.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import SubNavBar from '@/shared/components/SubNavBar/SubNavBar.jsx'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import { formatOrderDate } from '@/shared/utils/orderDate.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { useRestaurantOrders } from '@/features/restaurant-orders-page/RestaurantOrders/RestaurantOrders.hooks.js'
import styles from '@/features/restaurant-orders-page/RestaurantOrders/RestaurantOrders.module.css'

const ALL_ORDERS = 'all'

const ACTIONS = {
	[ORDER_STATUS.PLACED]: [
		{ status: ORDER_STATUS.ACCEPTED, labelKey: 'accept' },
		{
			status: ORDER_STATUS.REJECTED,
			labelKey: 'reject',
			variant: 'secondary',
		},
	],
	[ORDER_STATUS.ACCEPTED]: [
		{ status: ORDER_STATUS.READY, labelKey: 'markReady' },
	],
}

function OrderCard({ order, isOpen, onOpen, pendingOrderId, onStatusChange }) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const actions = ACTIONS[order.status] ?? []
	const titleId = `order-${order.id}-title`
	const detailsId = `order-${order.id}-details`

	return (
		<article className={styles.order} aria-labelledby={titleId}>
			<h2>
				<button
					type="button"
					className={styles.orderToggle}
					aria-expanded={isOpen}
					aria-controls={detailsId}
					aria-disabled={isOpen}
					onClick={onOpen}
				>
					<span className={styles.orderHeading}>
						<span id={titleId}>
							{t('orderNumberLabel')} {order.id}
						</span>
						<time dateTime={order.placedAt}>
							{formatOrderDate(order.placedAt, language)}
						</time>
					</span>
					<span className={styles.status}>
						{getOrderStatusName(order, language)}
					</span>
					<span className={styles.chevron} aria-hidden="true" />
				</button>
			</h2>
			<div
				id={detailsId}
				className={styles.orderDetails}
				hidden={!isOpen}
			>
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
				{actions.length > 0 && (
					<div
						className={styles.actions}
						aria-busy={pendingOrderId === order.id}
					>
						{actions.map(({ status, labelKey, variant }) => (
							<Button
								key={status}
								label={t(labelKey)}
								aria-label={t('orderAction', {
									label: t(labelKey),
									id: order.id,
								})}
								variant={variant}
								disabled={pendingOrderId !== null}
								onClick={() => onStatusChange(order.id, status)}
							/>
						))}
					</div>
				)}
			</div>
		</article>
	)
}

export default function RestaurantOrders() {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const [filter, setFilter] = useState(ALL_ORDERS)
	const [selectedOrderId, setSelectedOrderId] = useState(null)
	const {
		orders = [],
		error,
		isLoading,
		pendingOrderId,
		changeStatus,
		refreshOrders,
	} = useRestaurantOrders()
	const statusNames = new Map(
		orders.map((order) => [
			order.status,
			getOrderStatusName(order, language),
		]),
	)
	const filters = [
		{ value: ALL_ORDERS, label: t('latest') },
		...Object.values(ORDER_STATUS)
			.filter((status) => statusNames.has(status))
			.map((value) => ({ value, label: statusNames.get(value) })),
	]
	const activeFilter = statusNames.has(filter) ? filter : ALL_ORDERS
	const visibleOrders =
		activeFilter === ALL_ORDERS
			? orders
			: orders.filter((order) => order.status === activeFilter)
	const openOrderId =
		visibleOrders.find((order) => order.id === selectedOrderId)?.id ??
		visibleOrders[0]?.id

	function selectFilter(nextFilter) {
		if (nextFilter === filter) return
		setFilter(nextFilter)
		setSelectedOrderId(null)
	}

	return (
		<section
			className={styles.page}
			aria-labelledby="restaurant-orders-title"
		>
			<div className={styles.heading}>
				<h1 id="restaurant-orders-title">{t('orders')}</h1>
				<Button
					label={t('refreshOrders')}
					variant="secondary"
					disabled={isLoading || pendingOrderId !== null}
					onClick={refreshOrders}
				/>
			</div>
			<SubNavBar
				label={t('filterByStatus')}
				options={filters}
				selected={activeFilter}
				onSelect={selectFilter}
			/>
			{isLoading ? (
				<RequestState title={t('loadingOrders')} isLoading />
			) : error ? null : visibleOrders.length === 0 ? (
				<RequestState title={t('noRestaurantOrders')} />
			) : (
				<ul
					className={styles.orders}
					aria-label={t('restaurantOrders')}
				>
					{visibleOrders.map((order) => (
						<li key={order.id}>
							<OrderCard
								order={order}
								isOpen={order.id === openOrderId}
								onOpen={() => {
									if (order.id !== openOrderId)
										setSelectedOrderId(order.id)
								}}
								pendingOrderId={pendingOrderId}
								onStatusChange={changeStatus}
							/>
						</li>
					))}
				</ul>
			)}
		</section>
	)
}
