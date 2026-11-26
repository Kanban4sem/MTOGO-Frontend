import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { RESTAURANTS_PATH } from '@/shared/data/paths.js'
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
	const { restaurant, menus, isLoading, error } =
		useRestaurantMenu(restaurantId)
	useRequestErrorNotification(
		error,
		error &&
			withErrorReference(
				error.status === 404
					? 'Restauranten findes ikke eller tager ikke imod bestillinger lige nu.'
					: 'Vi kunne ikke hente menuen. Prøv at genindlæse siden om lidt.',
				error,
			),
	)

	return (
		<div className={styles.page}>
			<Helmet title={restaurant?.name || 'Restaurantmenu'} />
			<Link className={styles.back} to={RESTAURANTS_PATH}>
				<span
					className="chevron"
					data-direction="left"
					aria-hidden="true"
				/>
				Alle restauranter
			</Link>
			{isLoading ? (
				<RequestState title="Vi finder menuen frem…" isLoading />
			) : error ? (
				<Link to={RESTAURANTS_PATH}>Find en restaurant</Link>
			) : (
				<>
					<header className={styles.intro}>
						<div>
							<h1>{restaurant.name}</h1>
							<p className={styles.description}>
								Gå på opdagelse i menuen, og find det, du har
								lyst til i dag.
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
	const basketRestaurant = { id: restaurant.id, name: restaurant.name }
	const {
		requestAdd,
		menuItemAwaitingNewBasket,
		startNewBasket,
		keepBasket,
	} = useMenuBasket(basketRestaurant)

	return (
		<>
			<div className={styles.menuWithBasket}>
				<div className={styles.menus}>
					{menus.length === 0 ? (
						<RequestState title="Menuen er på vej">
							Restauranten har ingen aktiv menu lige nu. Kig forbi
							igen senere.
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
										<p>{menu.description}</p>
									)}
								</div>
								{menu.items.length === 0 ? (
									<RequestState title="Køkkenet gør klar">
										Denne menu har ingen tilgængelige retter
										lige nu.
									</RequestState>
								) : (
									<ul className={styles.items}>
										{menu.items.map((item) => (
											<MenuItem
												key={item.id}
												restaurantId={restaurant.id}
												item={item}
												onAdd={requestAdd}
											/>
										))}
									</ul>
								)}
							</section>
						))
					)}
					<p className={styles.priceNote}>
						Alle priser er i danske kroner.
					</p>
				</div>
				<div className={styles.basketRail}>
					<BasketSidePanel />
				</div>
			</div>
			<BasketBottomBar />
			<NewBasketDialog
				menuItem={menuItemAwaitingNewBasket}
				onConfirm={startNewBasket}
				onCancel={keepBasket}
			/>
		</>
	)
}

function MenuBar({ menus }) {
	const itemCount = menus.reduce(
		(count, menu) => count + menu.items.length,
		0,
	)

	return (
		<div className={styles.menuBar}>
			<span>Vores menu</span>
			<span>
				{itemCount} {itemCount === 1 ? 'ret' : 'retter'}
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
				<AddToBasketButton
					restaurantId={restaurantId}
					menuItem={item}
					onAdd={onAdd}
				/>
			</div>
		</li>
	)
}

function Price({ price }) {
	return <span className={styles.price}>{formatPrice(price)}</span>
}
