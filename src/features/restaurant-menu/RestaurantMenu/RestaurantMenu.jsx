import FoodImage from '@/shared/components/FoodImage/FoodImage.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { useRestaurantMenu } from './RestaurantMenu.hooks.js'
import styles from './RestaurantMenu.module.css'

export default function RestaurantMenu({ restaurantId }) {
	const { restaurant, menus, isLoading, error } =
		useRestaurantMenu(restaurantId)
	const itemCount = menus.reduce(
		(count, menu) => count + menu.items.length,
		0,
	)

	return (
		<div className={styles.page}>
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
					<div className={styles.menuBar}>
						<span>Vores menu</span>
						<span>
							{itemCount} {itemCount === 1 ? 'ret' : 'retter'}
						</span>
					</div>
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
											<li
												key={item.id}
												className={styles.item}
											>
												<FoodImage
													className={styles.itemImage}
													src={item.imageUrl}
													alt={item.name}
													loading="lazy"
												/>
												<div
													className={
														styles.itemDescription
													}
												>
													<h3>{item.name}</h3>
													{item.description && (
														<p>
															{item.description}
														</p>
													)}
												</div>
												<span className={styles.price}>
													{formatPrice(item.price)}
												</span>
											</li>
										))}
									</ul>
								)}
							</section>
						))
					)}
					<p className={styles.priceNote}>
						Alle priser er i danske kroner.
					</p>
				</>
			)}
		</div>
	)
}
