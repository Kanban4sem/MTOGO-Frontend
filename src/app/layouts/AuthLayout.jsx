import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

function AuthLayout({ title, children }) {
	const { isEnabled } = useFeatureFlags()

	return (
		<div className="authLayout">
			<Helmet title={title} />
			<main>
				<Link className="authBackLink" to="/">
					Tilbage til forsiden
				</Link>
				{isEnabled('authEnabled') ? (
					children
				) : (
					<p>Login og registrering er ikke tilgængeligt lige nu.</p>
				)}
			</main>
		</div>
	)
}

export default AuthLayout
