import { Link, NavLink } from 'react-router-dom'
import BrandLink from '@/shared/components/BrandLink/BrandLink.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import Dropdown from '@/shared/components/Dropdown/Dropdown.jsx'
import LanguageIndicator from '@/shared/components/LanguageIndicator/LanguageIndicator.jsx'
import NotificationDropdown from '@/shared/components/NotificationDropdown/NotificationDropdown.jsx'
import {
	CHECKOUT_PATH,
	CUSTOMER_ORDERS_PATH,
	CUSTOMER_SETTINGS_PATH,
	DASHBOARD_PATH,
	LOGIN_PATH,
	PROFILE_PATH,
	RESTAURANTS_PATH,
	RESTAURANT_ORDERS_PATH,
	RESTAURANT_PROFILE_PATH,
} from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { formatItemCount } from '@/shared/utils/basketMessages.js'
import { useNavBar } from '@/shared/components/NavBar/NavBar.hooks.js'
import styles from '@/shared/components/NavBar/NavBar.module.css'

const CUSTOMER_PROFILE_LINK = { label: 'Profiloversigt', to: PROFILE_PATH }
const CUSTOMER_SETTINGS_LINK = {
	label: 'Indstillinger',
	to: CUSTOMER_SETTINGS_PATH,
}
const CUSTOMER_ORDER_LINK = { label: 'Mine ordrer', to: CUSTOMER_ORDERS_PATH }
const CUSTOMER_LINKS = [
	CUSTOMER_PROFILE_LINK,
	CUSTOMER_SETTINGS_LINK,
	CUSTOMER_ORDER_LINK,
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
		customerId,
		isRestaurant,
		isDeliveryAgent,
		isLoading,
		isLoggingOut,
		logout,
	} = useNavBar()
	const { itemCount } = useBasket()
	const showBasket =
		!isLoading && (!isAuthenticated || isCustomer) && itemCount > 0

	return (
		<header className={styles.header}>
			<nav className={styles.nav} aria-label="Hovednavigation">
				<BrandLink />
				<ul className={styles.entries}>
					<li>
						<NavLink to={RESTAURANTS_PATH}>Restauranter</NavLink>
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
					{isAuthenticated && !isLoading && (
						<NotificationDropdown
							key={customerId ?? 'signed-in'}
							enabled={customerId !== null}
						/>
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
								onClick={logout}
								disabled={isLoggingOut}
							/>
							{isRestaurant ? (
								<Dropdown
									label="Restaurant"
									links={RESTAURANT_LINKS}
									buttonClassName={styles.account}
								/>
							) : isCustomer || isDeliveryAgent ? (
								<Dropdown
									label="Din profil"
									links={
										isDeliveryAgent
											? DELIVERY_AGENT_LINKS
											: CUSTOMER_LINKS
									}
									buttonClassName={styles.account}
								/>
							) : (
								<Link
									className={styles.account}
									to={PROFILE_PATH}
								>
									Din profil
								</Link>
							)}
						</>
					) : (
						<>
							<Link className={styles.link} to={LOGIN_PATH}>
								Log ind
							</Link>
							<Link className={styles.account} to="/register">
								Opret bruger
							</Link>
						</>
					)}
					<LanguageIndicator />
				</div>
			</nav>
		</header>
	)
}

export default NavBar
