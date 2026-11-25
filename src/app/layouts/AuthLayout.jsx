import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

function AuthLayout({ title, children }) {
	return (
		<div className="authLayout">
			<Helmet title={title} />
			<main>
				<Link className="authBackLink" to="/">
					Tilbage til forsiden
				</Link>
				{children}
			</main>
		</div>
	)
}

export default AuthLayout
