import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'

export default function NotFoundPage() {
	return (
		<div className="notFoundPage">
			<Helmet title="404 – Siden blev ikke fundet" />
			<RequestState
				title="Denne side er desværre ikke på menuen!"
				headingLevel="h1"
				symbol=":("
			>
				<span>Fejl 404.</span>
				<Link className="notFoundPageHomeLink" to="/">
					Tilbage til forsiden
				</Link>
			</RequestState>
		</div>
	)
}
