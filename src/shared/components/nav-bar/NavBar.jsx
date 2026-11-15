import { Link } from 'react-router-dom'
import Button from '@/shared/components/Button/Button.jsx'
import LanguageIndicator from '@/shared/components/language-indicator/LanguageIndicator.jsx'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'
import { useNavBar } from './NavBar.hooks.js'
import styles from './NavBar.module.css'

function NavBar() {
	const { isAuthenticated, isLoading, isLoggingOut, error, handleLogout } =
		useNavBar()
	const { isEnabled } = useFeatureFlags()

	return (
		<header className={styles.header}>
			<nav className={styles.nav} aria-label="Hovednavigation">
				<Link
					className={styles.brand}
					to="/"
					aria-label="MTOGO forside"
				>
					<span className={styles.brandIcon} aria-hidden="true">
						m.
					</span>
					MTOGO<span className={styles.brandDot}>.</span>
				</Link>
				<ul className={styles.entries}>
					<li>
						<a href="/#restaurants">Restauranter</a>
					</li>
					<li>
						<span>For virksomheder</span>
					</li>
					<li>
						<span>Bliv leveringsbud</span>
					</li>
				</ul>
				<div className={styles.actions}>
					{isLoading ? (
						<span className={styles.loading} role="status">
							Henter loginstatus…
						</span>
					) : isAuthenticated ? (
						<>
							<Button
								className={styles.logout}
								label={isLoggingOut ? 'Logger ud…' : 'Log ud'}
								onClick={handleLogout}
								disabled={isLoggingOut}
							/>
							<Link className={styles.account} to="/profile">
								Din profil
							</Link>
						</>
					) : isEnabled('authEnabled') ? (
						<>
							<Link className={styles.link} to="/login">
								Log ind
							</Link>
							<Link className={styles.account} to="/register">
								Opret bruger
							</Link>
						</>
					) : null}
					<LanguageIndicator />
				</div>
			</nav>
			{error && (
				<p className={styles.error} role="alert">
					{error}
				</p>
			)}
		</header>
	)
}

export default NavBar
