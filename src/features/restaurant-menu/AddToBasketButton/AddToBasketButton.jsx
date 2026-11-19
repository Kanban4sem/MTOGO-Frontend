import { useId } from 'react'
import Button from '@/shared/components/Button/Button.jsx'
import { useBasket } from '@/shared/hooks/useBasket.js'
import styles from './AddToBasketButton.module.css'

export default function AddToBasketButton({ restaurantId, menuItem, onAdd }) {
	const { getQuantity, getAddBlockedReason, isFromOtherRestaurant } =
		useBasket()
	const reasonId = useId()
	const quantity = getQuantity(menuItem.id)
	// Adding from another restaurant starts a new basket, so the current basket's limits don't apply.
	const reason = isFromOtherRestaurant(restaurantId)
		? ''
		: getAddBlockedReason(menuItem.id)
	const isBlocked = reason !== ''

	return (
		<div className={styles.add}>
			<Button
				size="s"
				label={
					<>
						{quantity > 0
							? `Tilføj én mere (${quantity})`
							: 'Læg i kurv'}
						<span className="visuallyHidden">
							: {menuItem.name}
						</span>
					</>
				}
				onClick={() => onAdd(menuItem)}
				disabled={isBlocked}
				{...(isBlocked && { 'aria-describedby': reasonId })}
			/>
			{isBlocked && (
				<span id={reasonId} className={styles.reason}>
					{reason}
				</span>
			)}
		</div>
	)
}
