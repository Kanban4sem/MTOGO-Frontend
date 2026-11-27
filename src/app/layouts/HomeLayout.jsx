import messages from '@/app/layouts/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link, Outlet, ScrollRestoration } from 'react-router-dom'
import NavBar from '@/shared/components/NavBar/NavBar.jsx'

export default function HomeLayout({ children }) {
	const t = useTranslations(messages)
	return (
		<>
			<ScrollRestoration />
			<a className="homeSkipLink" href="#main">
				{t('skipToContent')}
			</a>
			<NavBar />
			<div className="homeLayout">
				<main id="main">{children ?? <Outlet />}</main>
				<footer className="homeFooter">
					<Link className="homeFooterBrand" to="/">
						MTOGO<span>.</span>
					</Link>
					<p>{t('footerTagline')}</p>
					<span>{t('footerDescription')}</span>
				</footer>
			</div>
		</>
	)
}
