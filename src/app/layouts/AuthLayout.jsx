// Pathing
// _______
// src/app/layouts/AuthLayout.jsx

import { Outlet } from 'react-router-dom'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

function AuthLayout() {
	const { isEnabled } = useFeatureFlags()

	return (
		<div className="authLayout">
			{/* Page Specific */}
			<main>
				{isEnabled('authEnabled') ? (
					<Outlet />
				) : (
					<p>Login og registrering er ikke tilgængeligt lige nu.</p>
				)}
			</main>
		</div>
	)
}

export default AuthLayout
