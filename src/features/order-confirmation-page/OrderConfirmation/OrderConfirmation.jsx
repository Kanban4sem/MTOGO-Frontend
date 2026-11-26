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
	const {
		isLoading,
		data: order,
		error,
		reload,
	} = useOrderConfirmation(orderId)
	const orderNotFound = error && isOrderNotFound(error)
	useRequestErrorNotification(
		error,
		orderNotFound
			? 'Ordren blev ikke fundet.'
			: error &&
					`Vi kunne ikke hente ordre nr. ${orderId}. ${error.message}`,
	)

	if (isLoading) {
		return <RequestState title="Henter din ordre…" isLoading />
	}
	if (error) {
		if (orderNotFound) {
			return <RequestState title="Ordren blev ikke fundet" />
		}
		// Checkout has already emptied the basket, so keep the order number in view and let the customer retry.
		return (
			<RequestState title={`Ordre nr. ${orderId}`}>
				<Button label="Prøv igen" onClick={reload} />
			</RequestState>
		)
	}

	const { deliveryAddress, statusName } = order

	return (
		<section
			className={styles.confirmation}
			aria-labelledby="confirmation-title"
		>
			<header className={styles.intro}>
				{statusName?.danish && (
					<p className={styles.status}>
						Status: <strong>{statusName.danish}</strong>
					</p>
				)}
				<h1 id="confirmation-title">Tak for din bestilling!</h1>
				<p>
					Din ordre har nummer <strong>{order.id}</strong>.
				</p>
			</header>
			<div className={styles.details}>
				<section className={styles.card} aria-labelledby="order-lines">
					<h2 id="order-lines">Din ordre</h2>
					<table className={styles.lines}>
						<thead>
							<tr>
								<th scope="col">Ret</th>
								<th scope="col">Pris</th>
								<th scope="col">Antal</th>
								<th scope="col">I alt</th>
							</tr>
						</thead>
						<tbody>
							{order.lines.map((line) => (
								<tr key={line.menuItemId}>
									<th scope="row">{line.name}</th>
									<td data-label="Pris">
										{formatPrice(line.unitPrice)}
									</td>
									<td data-label="Antal">{line.quantity}</td>
									<td data-label="I alt">
										{formatPrice(line.subtotal)}
									</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<th scope="row" colSpan={3}>
									Ordretotal
								</th>
								<td>{formatPrice(order.total)}</td>
							</tr>
						</tfoot>
					</table>
				</section>
				<section
					className={styles.card}
					aria-labelledby="order-address"
				>
					<h2 id="order-address">Leveringsadresse</h2>
					<address className={styles.address}>
						{formatDeliveryAddress(deliveryAddress, '\n')}
						<br />
						{getCountryName(deliveryAddress.country)}
					</address>
				</section>
			</div>
			<Link className={styles.home} to="/">
				Gå til forsiden
			</Link>
		</section>
	)
}
