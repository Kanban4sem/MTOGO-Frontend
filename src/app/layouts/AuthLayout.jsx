// Pathing
// _______
// src/app/layouts/AuthLayout.jsx

import { Helmet } from 'react-helmet-async'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

function AuthLayout({ title, children }) {
	const { isEnabled } = useFeatureFlags()

	return (
		<div className="authLayout">
			<Helmet title={title} />
			{/* Page Specific */}
			<main>
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
