import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BrandLink from '@/shared/components/BrandLink/BrandLink.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { SubNavLinks } from '@/shared/components/SubNavBar/SubNavBar.jsx'
import { useAuth } from '@/shared/hooks/useAuth.js'
import styles from './DashboardLayout.module.css'

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
		<div className={styles.layout}>
			<aside className={styles.sidebar}>
				<div className={styles.brand}>
					<BrandLink />
				</div>
				<div className={styles.identity}>
					<p className={styles.title}>{label}</p>
					{name && <p className={styles.name}>{name}</p>}
				</div>
				<hr className={styles.divider} />
				<SubNavLinks label={label} links={links} />
				<Button
					className={styles.logout}
					label={isLoggingOut ? 'Logger ud…' : 'Log ud'}
					variant="secondary"
					onClick={leaveDashboard}
					disabled={isLoggingOut}
				/>
			</aside>
			<main className={styles.content}>{children}</main>
		</div>
	)
}
