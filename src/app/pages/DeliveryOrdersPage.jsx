import messages from '@/features/delivery-orders-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import DeliveryOrders from '@/features/delivery-orders-page/DeliveryOrders/DeliveryOrders.jsx'

export default function DeliveryOrdersPage({ available = false }) {
	const t = useTranslations(messages)
	return (
		<>
			<Helmet title={available ? t('dashboard') : t('orders')} />
			<DeliveryOrders available={available} />
		</>
	)
}
