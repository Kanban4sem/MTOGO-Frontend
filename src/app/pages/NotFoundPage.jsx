import RequestState from '@/shared/components/RequestState/RequestState.jsx'

export default function NotFoundPage() {
	return (
		<RequestState title="Denne side er ikke på menuen">
			<a href="/">Gå tilbage til forsiden</a>
		</RequestState>
	)
}
