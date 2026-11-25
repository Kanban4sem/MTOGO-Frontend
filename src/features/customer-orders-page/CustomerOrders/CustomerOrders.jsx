import { Link } from 'react-router-dom'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import {
	CUSTOMER_ORDERS_PATH,
	getCustomerOrderPath,
} from '@/shared/data/paths.js'
import { formatDeliveryAddress } from '@/shared/utils/formatDeliveryAddress.js'
import { ORDER_DATE } from '@/shared/utils/orderDate.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { isOrderNotFound } from '@/shared/utils/orderErrors.js'
import { useCustomerOrders } from '@/features/customer-orders-page/CustomerOrders/CustomerOrders.hooks.js'
import styles from '@/features/customer-orders-page/CustomerOrders/CustomerOrders.module.css'

function OrderStatus({ order }) {
	return <span className={styles.orderStatus}>{order.statusName.danish}</span>
}

function OrderList({ orders }) {
	if (orders.length === 0) {
		return <RequestState title="Du har ingen ordrer endnu" />
	}

	return (
		<ul className={styles.orders}>
			{orders.map((order) => (
				<li key={order.id}>
					<Link
						to={getCustomerOrderPath(order.id)}
						className={styles.orderLink}
					>
						<strong>Ordre nr. {order.id}</strong>
						<OrderStatus order={order} />
						<span>{formatPrice(order.total)}</span>
						<span className={styles.deliveryAddress}>
							{formatDeliveryAddress(order.deliveryAddress) ??
								'Adresse ikke tilgængelig'}
						</span>
					</Link>
				</li>
			))}
		</ul>
	)
}

function OrderDetails({ order }) {
	return (
		<>
			<p className={styles.orderMeta}>
				<OrderStatus order={order} />
				<time dateTime={order.placedAt}>
					{ORDER_DATE.format(new Date(order.placedAt))}
				</time>
			</p>
			<p className={styles.deliveryAddress}>
				<strong>Leveringsadresse:</strong>{' '}
				{formatDeliveryAddress(order.deliveryAddress) ??
					'Adresse ikke tilgængelig'}
			</p>
			<section className={styles.receipt} aria-labelledby="order-lines">
				<h2 id="order-lines">Ordrelinjer</h2>
				<ul className={styles.lines}>
					{order.lines.map((line) => (
						<li key={line.menuItemId}>
							<div>
								<strong>{line.name}</strong>
								<p>
									{line.quantity} stk. à{' '}
									{formatPrice(line.unitPrice)}
								</p>
							</div>
							<span>{formatPrice(line.subtotal)}</span>
						</li>
					))}
				</ul>
				<p className={styles.total}>
					<span>I alt</span>
					<strong>{formatPrice(order.total)}</strong>
				</p>
			</section>
		</>
	)
}

function OrderContent({ orderId }) {
	const { isLoading, data, error } = useCustomerOrders(orderId)

	if (isLoading) {
		return <RequestState title="Henter ordrer…" isLoading />
	}
	if (error) {
		if (orderId !== undefined && isOrderNotFound(error)) {
			return <RequestState title="Ordren blev ikke fundet" />
		}
		return (
			<RequestState title="Vi kunne ikke hente dine ordrer">
				{error.message}
			</RequestState>
		)
	}
	if (orderId === undefined) return <OrderList orders={data} />
	return <OrderDetails order={data} />
}

export default function CustomerOrders({ orderId }) {
	return (
		<section
			className={styles.page}
			aria-labelledby="customer-orders-title"
		>
			{orderId !== undefined && (
				<Link to={CUSTOMER_ORDERS_PATH}>Tilbage til mine ordrer</Link>
			)}
			<h1 id="customer-orders-title">
				{orderId === undefined ? 'Mine ordrer' : `Ordre nr. ${orderId}`}
			</h1>
			<OrderContent orderId={orderId} />
		</section>
	)
}
