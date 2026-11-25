import BrandLink from '@/shared/components/BrandLink/BrandLink.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { SubNavLinks } from '@/shared/components/SubNavBar/SubNavBar.jsx'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useLogout } from '@/shared/hooks/useLogout.js'

export default function DashboardLayout({ label, links, children }) {
	const { user } = useAuth()
	// The error is not shown: signing out leaves the dashboard for the homepage at once.
	const { isLoggingOut, logout } = useLogout()
	const name = [user?.profile?.firstName, user?.profile?.lastName]
		.filter(Boolean)
		.join(' ')

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
					onClick={logout}
					disabled={isLoggingOut}
				/>
			</aside>
			<main className="dashboardContent">{children}</main>
		</div>
	)
}
