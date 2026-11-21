import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'

export default function NotFoundPage() {
	return (
		<>
			<Helmet title="Siden blev ikke fundet" />
			<RequestState title="Denne side er ikke på menuen">
				<Link to="/">Gå tilbage til forsiden</Link>
			</RequestState>
		</>
	)
}
