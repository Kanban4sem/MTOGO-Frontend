import { Link } from 'react-router-dom'
import BrandLink from '@/shared/components/BrandLink/BrandLink.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import Dropdown from '@/shared/components/Dropdown/Dropdown.jsx'
import LanguageIndicator from '@/shared/components/LanguageIndicator/LanguageIndicator.jsx'
import {
	CHECKOUT_PATH,
	CUSTOMER_ORDERS_PATH,
	DASHBOARD_PATH,
	RESTAURANT_ORDERS_PATH,
	RESTAURANT_PROFILE_PATH,
} from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'
import { formatItemCount } from '@/shared/utils/basketMessages.js'
import { useNavBar } from '@/shared/components/NavBar/NavBar.hooks.js'
import styles from '@/shared/components/NavBar/NavBar.module.css'

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
const DELIVERY_AGENT_LINKS = [{ label: 'Dashboard', to: DASHBOARD_PATH }]

function NavBar() {
	const {
		isAuthenticated,
		isCustomer,
		isRestaurant,
		isDeliveryAgent,
		isLoading,
		isLoggingOut,
		error,
		handleLogout,
	} = useNavBar()
	const { isEnabled } = useFeatureFlags()
	const { itemCount } = useBasket()
	const orderingEnabled = isEnabled('orderingEnabled')
	const showBasket =
		orderingEnabled &&
		!isLoading &&
		(!isAuthenticated || isCustomer) &&
		itemCount > 0

	return (
		<header className={styles.header}>
			<nav className={styles.nav} aria-label="Hovednavigation">
				<BrandLink />
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
					{showBasket && (
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
							) : orderingEnabled &&
							  (isCustomer || isDeliveryAgent) ? (
								<Dropdown
									label="Din profil"
									links={
										isDeliveryAgent
											? DELIVERY_AGENT_LINKS
											: PROFILE_LINKS
									}
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
