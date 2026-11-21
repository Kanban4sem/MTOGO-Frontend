import { Helmet } from 'react-helmet-async'
import DeliveryOrders from '@/features/delivery-orders-page/DeliveryOrders/DeliveryOrders.jsx'

export default function DeliveryOrdersPage({ available = false }) {
	return (
		<>
			<Helmet title={available ? 'Dashboard' : 'Ordrer'} />
			<DeliveryOrders available={available} />
		</>
	)
}
