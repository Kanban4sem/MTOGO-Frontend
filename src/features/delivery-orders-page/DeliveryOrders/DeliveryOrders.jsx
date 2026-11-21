import { useState } from 'react'
import Button from '@/shared/components/Button/Button.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import SubNavBar from '@/shared/components/SubNavBar/SubNavBar.jsx'
import { getOrderStatusName } from '@/shared/data/orderStatus.js'
import { useDeliveryOrders } from './DeliveryOrders.hooks.js'
import styles from './DeliveryOrders.module.css'

const FILTERS = [
	{ value: 'active', label: 'Aktive' },
	{ value: 'completed', label: 'Afsluttede' },
]

const TAKE = { action: 'TAKE', label: 'Tag ordre' }
const ASSIGNED_ACTIONS = {
	READY: { action: 'PICK_UP', label: 'Markér som afhentet' },
	PICKED_UP: { action: 'DELIVER', label: 'Markér som leveret' },
}

function OrderCard({ order, pendingOrderId, onChange }) {
	const next = order.assignedToMe ? ASSIGNED_ACTIONS[order.status] : TAKE

	return (
		<details className={styles.card}>
			<summary className={styles.summary}>
				<span className={styles.orderTitle}>
					<strong>Ordre nr. {order.id}</strong>
					<span>{order.restaurantName}</span>
				</span>
				<span className={styles.status}>
					{getOrderStatusName(order.status, order.statusName)}
				</span>
				<span className={styles.chevron} aria-hidden="true" />
			</summary>
			<div
				className={styles.details}
				aria-busy={pendingOrderId === order.id}
			>
				<p>
					<strong>Levering til:</strong> Kommer snart
				</p>
				{next && (
					<Button
						label={next.label}
						aria-label={`${next.label}, ordre nr. ${order.id}`}
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
	if (isLoading) return <RequestState title="Henter ordrer…" isLoading />
	if (error)
		return (
			<RequestState title="Vi kunne ikke hente ordrerne">
				{error.message}
			</RequestState>
		)
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
	const [filter, setFilter] = useState('active')
	const {
		orders = [],
		isLoading,
		error,
		pendingOrderId,
		orderUpdate,
		changeOrder,
		refreshOrders,
	} = useDeliveryOrders()
	const completed = filter === 'completed'
	const visibleOrders = orders.filter((order) => {
		if (available) return !order.assignedToMe && order.status === 'READY'
		return (
			order.assignedToMe &&
			(completed
				? order.status === 'DELIVERED'
				: order.status === 'READY' || order.status === 'PICKED_UP')
		)
	})
	const emptyTitle = available
		? 'Ingen ledige ordrer til afhentning'
		: completed
			? 'Du har ingen afsluttede leveringer'
			: 'Du har ingen aktive leveringer'

	const updatedOrder = orderUpdate?.order
	const orderTaken = orderUpdate?.action === TAKE.action

	return (
		<section
			className={styles.page}
			aria-labelledby="delivery-orders-title"
		>
			<header className={styles.heading}>
				<h1 id="delivery-orders-title">
					{available ? 'Ledige ordrer' : 'Ordrer'}
				</h1>
				<Button
					label="Opdatér ordrer"
					variant="secondary"
					disabled={isLoading || pendingOrderId !== null}
					onClick={refreshOrders}
				/>
			</header>
			{!available && (
				<SubNavBar
					label="Filtrér dine leveringer"
					options={FILTERS}
					selected={filter}
					onSelect={setFilter}
				/>
			)}
			<div>
				<div role="alert">
					{orderUpdate?.error && (
						<p className={styles.error}>{orderUpdate.error}</p>
					)}
				</div>
				<div role="status">
					{updatedOrder && (
						<p className={styles.notice}>
							Ordre nr. {updatedOrder.id} ·{' '}
							{orderTaken
								? 'Overtaget. Se den under Ordrer.'
								: getOrderStatusName(
										updatedOrder.status,
										updatedOrder.statusName,
									)}
						</p>
					)}
				</div>
				<DeliveryOrderList
					orders={visibleOrders}
					isLoading={isLoading}
					error={error}
					emptyTitle={emptyTitle}
					pendingOrderId={pendingOrderId}
					onChange={changeOrder}
				/>
			</div>
		</section>
	)
}
