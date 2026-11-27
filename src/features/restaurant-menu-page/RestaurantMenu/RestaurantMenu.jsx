import { useLanguage } from '@/shared/i18n/useLanguage.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/restaurant-menu-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import FeatureUnavailable from '@/shared/components/FeatureUnavailable/FeatureUnavailable.jsx'
import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { RESTAURANTS_PATH } from '@/shared/data/paths.js'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'
import { useMaintenance } from '@/shared/hooks/useMaintenance.js'
import { useRequestErrorNotification } from '@/shared/hooks/useNotification.js'
import { withErrorReference } from '@/shared/utils/errorReference.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import AddToBasketButton from '@/features/restaurant-menu-page/AddToBasketButton/AddToBasketButton.jsx'
import BasketBottomBar from '@/features/restaurant-menu-page/BasketBottomBar/BasketBottomBar.jsx'
import BasketSidePanel from '@/features/restaurant-menu-page/BasketSidePanel/BasketSidePanel.jsx'
import NewBasketDialog from '@/features/restaurant-menu-page/NewBasketDialog/NewBasketDialog.jsx'
import {
	useMenuBasket,
	useRestaurantMenu,
} from '@/features/restaurant-menu-page/RestaurantMenu/RestaurantMenu.hooks.js'
import styles from '@/features/restaurant-menu-page/RestaurantMenu/RestaurantMenu.module.css'

export default function RestaurantMenu({ restaurantId }) {
	const t = useTranslations(messages)
	const { restaurant, menus, isLoading, error } =
		useRestaurantMenu(restaurantId)
	useRequestErrorNotification(error, (language) =>
		withErrorReference(
			error.status === 404
				? translate(messages, language, 'restaurantUnavailable')
				: translate(messages, language, 'menuFailed'),
			error,
			language,
		),
	)

	return (
		<div className={styles.page}>
			<Helmet title={restaurant?.name || t('restaurantMenu')} />
			<Link className={styles.back} to={RESTAURANTS_PATH}>
				<span
					className="chevron"
					data-direction="left"
					aria-hidden="true"
				/>
				{t('allRestaurants')}
			</Link>
			{isLoading ? (
				<RequestState title={t('loadingMenu')} isLoading />
			) : error ? (
				<Link to={RESTAURANTS_PATH}>{t('findRestaurant')}</Link>
			) : (
				<>
					<header className={styles.intro}>
						<div>
							<h1>{restaurant.name}</h1>
							<p className={styles.description}>
								{t('menuDescription')}
							</p>
						</div>
					</header>
					<MenuBar menus={menus} />
					<hr className={styles.menuDivider} />
					<Menus restaurant={restaurant} menus={menus} />
				</>
			)}
		</div>
	)
}

function Menus({ restaurant, menus }) {
	const t = useTranslations(messages)
	const { pauses, isLoading } = useMaintenance()
	const orderingPause = pauses[MAINTENANCE_FEATURES.ORDERING]
	const canOrder = !isLoading && !orderingPause
	const basketRestaurant = { id: restaurant.id, name: restaurant.name }
	const {
		requestAdd,
		menuItemAwaitingNewBasket,
		startNewBasket,
		keepBasket,
	} = useMenuBasket(basketRestaurant)

	return (
		<>
			{orderingPause && (
				<div className={styles.orderingPause}>
					<FeatureUnavailable
						feature={MAINTENANCE_FEATURES.ORDERING}
					/>
				</div>
			)}
			<div className={canOrder ? styles.menuWithBasket : undefined}>
				<div className={styles.menus}>
					{menus.length === 0 ? (
						<RequestState title={t('menuComing')}>
							{t('noActiveMenu')}
						</RequestState>
					) : (
						menus.map((menu) => (
							<section
								key={menu.id}
								className={styles.menu}
								aria-labelledby={`menu-${menu.id}`}
							>
								<div className={styles.menuHeading}>
									<h2 id={`menu-${menu.id}`}>{menu.name}</h2>
									{menu.description && (
										<p>
											{menu.name === 'Menu' &&
											menu.description ===
												messages.da.seedMenuDescription
												? t('seedMenuDescription')
												: menu.description}
										</p>
									)}
								</div>
								{menu.items.length === 0 ? (
									<RequestState
										title={t('kitchenGettingReady')}
									>
										{t('noAvailableDishes')}
									</RequestState>
								) : (
									<ul className={styles.items}>
										{menu.items.map((item) => (
											<MenuItem
												key={item.id}
												restaurantId={restaurant.id}
												item={item}
												onAdd={
													canOrder
														? requestAdd
														: undefined
												}
											/>
										))}
									</ul>
								)}
							</section>
						))
					)}
					<p className={styles.priceNote}>{t('pricesInDKK')}</p>
				</div>
				{canOrder && (
					<div className={styles.basketRail}>
						<BasketSidePanel />
					</div>
				)}
			</div>
			{canOrder && (
				<>
					<BasketBottomBar />
					<NewBasketDialog
						menuItem={menuItemAwaitingNewBasket}
						onConfirm={startNewBasket}
						onCancel={keepBasket}
					/>
				</>
			)}
		</>
	)
}

function MenuBar({ menus }) {
	const t = useTranslations(messages)
	const itemCount = menus.reduce(
		(count, menu) => count + menu.items.length,
		0,
	)

	return (
		<div className={styles.menuBar}>
			<span>{t('ourMenu')}</span>
			<span>
				{t(itemCount === 1 ? 'oneDish' : 'dishCount', {
					count: itemCount,
				})}
			</span>
		</div>
	)
}

function MenuItem({ restaurantId, item, onAdd }) {
	return (
		<li className={styles.item}>
			<FoodImage
				className={styles.itemImage}
				src={item.imageUrl}
				alt={item.name}
				loading="lazy"
			/>
			<div className={styles.itemDescription}>
				<h3>{item.name}</h3>
				{item.description && <p>{item.description}</p>}
			</div>
			<div className={styles.order}>
				<Price price={item.price} />
				{onAdd && (
					<AddToBasketButton
						restaurantId={restaurantId}
						menuItem={item}
						onAdd={onAdd}
					/>
				)}
			</div>
		</li>
	)
}

function Price({ price }) {
	const { language } = useLanguage()
	return <span className={styles.price}>{formatPrice(price, language)}</span>
}
