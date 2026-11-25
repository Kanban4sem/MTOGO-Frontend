import { useState } from 'react'
import Button from '@/shared/components/Button/Button.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import SubNavBar from '@/shared/components/SubNavBar/SubNavBar.jsx'
import { ORDER_STATUS } from '@/shared/data/orderStatus.js'
import { ORDER_DATE } from '@/shared/utils/orderDate.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { useRestaurantOrders } from '@/features/restaurant-orders-page/RestaurantOrders/RestaurantOrders.hooks.js'
import styles from '@/features/restaurant-orders-page/RestaurantOrders/RestaurantOrders.module.css'

const ALL_ORDERS = { value: 'all', label: 'Nyeste' }

const ACTIONS = {
	[ORDER_STATUS.PLACED]: [
		{ status: ORDER_STATUS.ACCEPTED, label: 'Acceptér' },
		{
			status: ORDER_STATUS.REJECTED,
			label: 'Afvis',
			variant: 'secondary',
		},
	],
	[ORDER_STATUS.ACCEPTED]: [
		{ status: ORDER_STATUS.READY, label: 'Markér som klar' },
	],
}

function OrderCard({ order, isOpen, onOpen, pendingOrderId, onStatusChange }) {
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
						<span id={titleId}>Ordre nr. {order.id}</span>
						<time dateTime={order.placedAt}>
							{ORDER_DATE.format(new Date(order.placedAt))}
						</time>
					</span>
					<span className={styles.status}>
						{order.statusName.danish}
					</span>
					<span className={styles.chevron} aria-hidden="true" />
				</button>
			</h2>
			<div
				id={detailsId}
				className={styles.orderDetails}
				hidden={!isOpen}
			>
				<ul className={styles.lines} aria-label="Ordrelinjer">
					{order.lines.map((line) => (
						<li key={line.menuItemId}>
							<span>
								{line.quantity} × {line.name}
							</span>
							<span>{formatPrice(line.subtotal)}</span>
						</li>
					))}
				</ul>
				<p className={styles.total}>
					<span>I alt</span>
					<strong>{formatPrice(order.total)}</strong>
				</p>
				{actions.length > 0 && (
					<div
						className={styles.actions}
						aria-busy={pendingOrderId === order.id}
					>
						{actions.map(({ status, label, variant }) => (
							<Button
								key={status}
								label={label}
								aria-label={`${label}, ordre nr. ${order.id}`}
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
	const [filter, setFilter] = useState(ALL_ORDERS.value)
	const [selectedOrderId, setSelectedOrderId] = useState(null)
	const {
		orders = [],
		error,
		isLoading,
		pendingOrderId,
		updateError,
		updatedOrder,
		changeStatus,
		refreshOrders,
	} = useRestaurantOrders()
	const statusNames = new Map(
		orders.map(({ status, statusName }) => [status, statusName.danish]),
	)
	const filters = [
		ALL_ORDERS,
		...Object.values(ORDER_STATUS)
			.filter((status) => statusNames.has(status))
			.map((value) => ({ value, label: statusNames.get(value) })),
	]
	const activeFilter = statusNames.has(filter) ? filter : ALL_ORDERS.value
	const visibleOrders =
		activeFilter === ALL_ORDERS.value
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
				<h1 id="restaurant-orders-title">Ordrer</h1>
				<Button
					label="Opdatér ordrer"
					variant="secondary"
					disabled={isLoading || pendingOrderId !== null}
					onClick={refreshOrders}
				/>
			</div>
			<SubNavBar
				label="Filtrér efter status"
				options={filters}
				selected={activeFilter}
				onSelect={selectFilter}
			/>
			{updateError && (
				<p className={styles.error} role="alert">
					{updateError}
				</p>
			)}
			<div aria-live="polite">
				{updatedOrder && (
					<p className={styles.notice}>
						Ordre nr. {updatedOrder.id} ·{' '}
						{updatedOrder.statusName.danish}
					</p>
				)}
			</div>
			{isLoading ? (
				<RequestState title="Henter ordrer…" isLoading />
			) : error ? (
				<RequestState title="Vi kunne ikke hente ordrerne">
					{error.message}
				</RequestState>
			) : visibleOrders.length === 0 ? (
				<RequestState title="Restauranten har ingen ordrer endnu" />
			) : (
				<ul className={styles.orders} aria-label="Restaurantens ordrer">
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
