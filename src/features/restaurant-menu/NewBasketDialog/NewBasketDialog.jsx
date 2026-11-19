import { useEffect, useRef } from 'react'
import Button from '@/shared/components/Button/Button.jsx'
import { useBasket } from '@/shared/hooks/useBasket.js'
import styles from './NewBasketDialog.module.css'

export default function NewBasketDialog({ menuItem, onConfirm, onCancel }) {
	const { basket } = useBasket()
	const dialogRef = useRef(null)

	useEffect(() => {
		const dialog = dialogRef.current
		if (menuItem && !dialog.open) dialog.showModal()
		if (!menuItem && dialog.open) dialog.close()
	}, [menuItem])

	return (
		<dialog
			ref={dialogRef}
			className={styles.dialog}
			aria-labelledby="new-basket-title"
			onCancel={onCancel}
		>
			<h2 id="new-basket-title">Start en ny kurv?</h2>
			<p>
				Din kurv har retter fra{' '}
				<strong>{basket.restaurant?.name}</strong>. En kurv kan kun have
				retter fra én restaurant. Vil du tømme kurven og starte en ny
				med <strong>{menuItem?.name}</strong>?
			</p>
			<div className={styles.actions}>
				<Button
					variant="secondary"
					label="Behold kurven"
					onClick={onCancel}
				/>
				<Button label="Tøm og start ny kurv" onClick={onConfirm} />
			</div>
		</dialog>
	)
}
