import messages from '@/app/pages/NotFoundPage.messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'

export default function NotFoundPage() {
	const t = useTranslations(messages)
	return (
		<div className="notFoundPage">
			<Helmet title={t('pageNotFoundTitle')} />
			<RequestState
				title={t('pageNotFound')}
				headingLevel="h1"
				symbol=":("
			>
				<span>{t('error404')}</span>
				<Link className="notFoundPageHomeLink" to="/">
					{t('backHome')}
				</Link>
			</RequestState>
		</div>
	)
}
