import { Helmet } from 'react-helmet-async'
import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import AddToBasketButton from '@/features/restaurant-menu-page/AddToBasketButton/AddToBasketButton.jsx'
import BasketBottomBar from '@/features/restaurant-menu-page/BasketBottomBar/BasketBottomBar.jsx'
import BasketSidePanel from '@/features/restaurant-menu-page/BasketSidePanel/BasketSidePanel.jsx'
import NewBasketDialog from '@/features/restaurant-menu-page/NewBasketDialog/NewBasketDialog.jsx'
import {
	useMenuBasket,
	useRestaurantMenu,
} from '@/features/restaurant-menu-page/RestaurantMenu/RestaurantMenu.hooks.js'
import styles from './RestaurantMenu.module.css'

export default function RestaurantMenu({ restaurantId }) {
	const { restaurant, menus, isLoading, error } =
		useRestaurantMenu(restaurantId)
	const { isEnabled } = useFeatureFlags()
	const isOrderingEnabled =
		isEnabled('orderingEnabled') && restaurant !== null

	return (
		<div className={styles.page}>
			<Helmet title={restaurant?.name || 'Restaurantmenu'} />
			<a className={styles.back} href="/#restaurants">
				<span aria-hidden="true">←</span> Alle restauranter
			</a>
			{isLoading ? (
				<RequestState title="Vi finder menuen frem…" isLoading />
			) : error ? (
				<RequestState
					title={
						error.status === 404
							? 'Denne restaurant er ikke tilgængelig'
							: 'Vi kunne ikke hente menuen'
					}
				>
					{error.status === 404
						? 'Restauranten findes ikke eller tager ikke imod bestillinger lige nu.'
						: 'Prøv at genindlæse siden om lidt.'}{' '}
					<a href="/#restaurants">Find en restaurant</a>
				</RequestState>
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
					{isOrderingEnabled ? (
						<OrderableMenus restaurant={restaurant} menus={menus} />
					) : (
						<Menus menus={menus} />
					)}
				</>
			)}
		</div>
	)
}

function OrderableMenus({ restaurant, menus }) {
	const basketRestaurant = { id: restaurant.id, name: restaurant.name }
	const {
		requestAdd,
		menuItemAwaitingNewBasket,
		startNewBasket,
		keepBasket,
	} = useMenuBasket(basketRestaurant)

	return (
		<>
			<div className={styles.ordering}>
				<Menus
					menus={menus}
					renderAddControl={(item) => (
						<AddToBasketButton
							restaurantId={restaurant.id}
							menuItem={item}
							onAdd={requestAdd}
						/>
					)}
				/>
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

function Menus({ menus, renderAddControl }) {
	return (
		<div className={styles.menus}>
			{menus.length === 0 ? (
				<RequestState title="Menuen er på vej">
					Restauranten har ingen aktiv menu lige nu. Kig forbi igen
					senere.
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
							{menu.description && <p>{menu.description}</p>}
						</div>
						{menu.items.length === 0 ? (
							<RequestState title="Køkkenet gør klar">
								Denne menu har ingen tilgængelige retter lige
								nu.
							</RequestState>
						) : (
							<ul className={styles.items}>
								{menu.items.map((item) => (
									<li key={item.id} className={styles.item}>
										<FoodImage
											className={styles.itemImage}
											src={item.imageUrl}
											alt={item.name}
											loading="lazy"
										/>
										<div className={styles.itemDescription}>
											<h3>{item.name}</h3>
											{item.description && (
												<p>{item.description}</p>
											)}
										</div>
										{renderAddControl ? (
											<div className={styles.order}>
												<Price price={item.price} />
												{renderAddControl(item)}
											</div>
										) : (
											<Price price={item.price} />
										)}
									</li>
								))}
							</ul>
						)}
					</section>
				))
			)}
			<p className={styles.priceNote}>Alle priser er i danske kroner.</p>
		</div>
	)
}

function Price({ price }) {
	return <span className={styles.price}>{formatPrice(price)}</span>
}
