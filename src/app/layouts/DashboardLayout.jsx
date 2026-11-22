import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLink from '@/shared/components/BrandLink/BrandLink.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { SubNavLinks } from '@/shared/components/SubNavBar/SubNavBar.jsx'
import { useAuth } from '@/shared/hooks/useAuth.js'

export default function DashboardLayout({ label, links, children }) {
	const { user, logout } = useAuth()
	const navigate = useNavigate()
	const [isLoggingOut, setIsLoggingOut] = useState(false)
	const name = [user?.profile?.firstName, user?.profile?.lastName]
		.filter(Boolean)
		.join(' ')

	async function leaveDashboard() {
		if (isLoggingOut) return
		setIsLoggingOut(true)
		try {
			await logout()
		} catch {
			// AuthProvider clears the local session even if the server cannot revoke it.
		}
		navigate('/', { replace: true })
	}

	return (
		<div className="dashboardLayout">
			<aside className="dashboardSidebar">
				<div className="dashboardBrand">
					<BrandLink />
				</div>
				<div className="dashboardIdentity">
					<p className="dashboardTitle">{label}</p>
					{name && <p className="dashboardName">{name}</p>}
				</div>
				<hr className="dashboardDivider" />
				<SubNavLinks label={label} links={links} />
				<Button
					className="dashboardLogout"
					label={isLoggingOut ? 'Logger ud…' : 'Log ud'}
					variant="secondary"
					onClick={leaveDashboard}
					disabled={isLoggingOut}
				/>
			</aside>
			<main className="dashboardContent">{children}</main>
		</div>
	)
}
