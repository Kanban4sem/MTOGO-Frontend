import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/shared/components/NavBar/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
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
import { useMaintenance } from '@/shared/hooks/useMaintenance.js'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'
import { formatItemCount } from '@/shared/utils/basketMessages.js'
import { useNavBar } from '@/shared/components/NavBar/NavBar.hooks.js'
import styles from '@/shared/components/NavBar/NavBar.module.css'

function NavBar() {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const customerLinks = [
		{ label: t('profileOverview'), to: PROFILE_PATH },
		{ label: t('settings'), to: CUSTOMER_SETTINGS_PATH },
		{ label: t('myOrders'), to: CUSTOMER_ORDERS_PATH },
	]
	const restaurantLinks = [
		{ label: t('orders'), to: RESTAURANT_ORDERS_PATH },
		{ label: t('businessProfile'), to: RESTAURANT_PROFILE_PATH },
	]
	const deliveryAgentLinks = [{ label: t('dashboard'), to: DASHBOARD_PATH }]
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
	const { pauses, isLoading: isMaintenanceLoading } = useMaintenance()
	const showBasket =
		!isLoading &&
		!isMaintenanceLoading &&
		!pauses[MAINTENANCE_FEATURES.ORDERING] &&
		(!isAuthenticated || isCustomer) &&
		itemCount > 0

	return (
		<header className={styles.header}>
			<nav className={styles.nav} aria-label={t('mainNavigation')}>
				<BrandLink />
				<ul className={styles.entries}>
					<li>
						<NavLink to={RESTAURANTS_PATH}>
							{t('restaurants')}
						</NavLink>
					</li>
				</ul>
				<div className={styles.actions}>
					{showBasket && (
						<Link
							className={styles.link}
							to={CHECKOUT_PATH}
							aria-label={t('basketWithCount', {
								count: formatItemCount(itemCount, language),
							})}
						>
							{t('basket')}
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
							{t('checkingLoginStatus')}
						</span>
					) : isAuthenticated ? (
						<>
							<Button
								className={styles.logout}
								label={
									isLoggingOut ? t('loggingOut') : t('logout')
								}
								onClick={logout}
								disabled={isLoggingOut}
							/>
							{isRestaurant ? (
								<Dropdown
									label={t('restaurant')}
									links={restaurantLinks}
									buttonClassName={styles.account}
								/>
							) : isCustomer || isDeliveryAgent ? (
								<Dropdown
									label={t('yourProfile')}
									links={
										isDeliveryAgent
											? deliveryAgentLinks
											: customerLinks
									}
									buttonClassName={styles.account}
								/>
							) : (
								<Link
									className={styles.account}
									to={PROFILE_PATH}
								>
									{t('yourProfile')}
								</Link>
							)}
						</>
					) : (
						<>
							<Link className={styles.link} to={LOGIN_PATH}>
								{t('login')}
							</Link>
							<Link className={styles.account} to="/register">
								{t('createUser')}
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
