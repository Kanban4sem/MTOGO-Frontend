import { Link } from 'react-router-dom'
import Button from '@/shared/components/Button/Button.jsx'
import Dropdown from '@/shared/components/Dropdown/Dropdown.jsx'
import LanguageIndicator from '@/shared/components/LanguageIndicator/LanguageIndicator.jsx'
import {
	CHECKOUT_PATH,
	CUSTOMER_ORDERS_PATH,
	RESTAURANT_ORDERS_PATH,
	RESTAURANT_PROFILE_PATH,
} from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'
import { formatItemCount } from '@/shared/utils/basketMessages.js'
import { useNavBar } from './NavBar.hooks.js'
import styles from './NavBar.module.css'

const PROFILE_LINKS = [
	{ label: 'Profiloversigt', to: '/profile' },
	{ label: 'Mine ordrer', to: CUSTOMER_ORDERS_PATH },
]
const RESTAURANT_PROFILE_LINK = {
	label: 'Virksomhedsprofil',
	to: RESTAURANT_PROFILE_PATH,
}
const RESTAURANT_LINKS = [
	{ label: 'Ordrer', to: RESTAURANT_ORDERS_PATH },
	RESTAURANT_PROFILE_LINK,
]

function NavBar() {
	const {
		isAuthenticated,
		isCustomer,
		isRestaurant,
		isLoading,
		isLoggingOut,
		error,
		handleLogout,
	} = useNavBar()
	const { isEnabled } = useFeatureFlags()
	const { itemCount } = useBasket()
	const orderingEnabled = isEnabled('orderingEnabled')

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
					{orderingEnabled && itemCount > 0 && (
						<Link
							className={styles.link}
							to={CHECKOUT_PATH}
							aria-label={`Kurv, ${formatItemCount(itemCount)}`}
						>
							Kurv
							<span className={styles.basketCount}>
								{itemCount}
							</span>
						</Link>
					)}
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
							{isRestaurant ? (
								<Dropdown
									label="Restaurant"
									links={
										orderingEnabled
											? RESTAURANT_LINKS
											: [RESTAURANT_PROFILE_LINK]
									}
									buttonClassName={styles.account}
								/>
							) : isCustomer && orderingEnabled ? (
								<Dropdown
									label="Din profil"
									links={PROFILE_LINKS}
									buttonClassName={styles.account}
								/>
							) : (
								<Link className={styles.account} to="/profile">
									Din profil
								</Link>
							)}
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
