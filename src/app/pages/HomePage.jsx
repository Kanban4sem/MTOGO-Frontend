import messages from '@/features/home-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import Hero from '@/features/home-page/Hero/Hero.jsx'
import TrustedBy from '@/features/home-page/TrustedBy/TrustedBy.jsx'
import Restaurants from '@/features/home-page/Restaurants/Restaurants.jsx'

export default function HomePage() {
	const t = useTranslations(messages)
	return (
		<>
			<Helmet title={t('home')} />
			<Hero />
			<TrustedBy />
			<Restaurants />
		</>
	)
}
