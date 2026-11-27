import messages from '@/features/restaurant-menu-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useEffect, useRef } from 'react'
import Button from '@/shared/components/Button/Button.jsx'
import { useBasket } from '@/shared/hooks/useBasket.js'
import styles from '@/features/restaurant-menu-page/NewBasketDialog/NewBasketDialog.module.css'

export default function NewBasketDialog({ menuItem, onConfirm, onCancel }) {
	const t = useTranslations(messages)
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
			<h2 id="new-basket-title">{t('startBasket')}</h2>
			<p>
				{t('basketContainsDishesFrom')}{' '}
				<strong>{basket.restaurant?.name}</strong>
				{t('replaceBasketPrompt')} <strong>{menuItem?.name}</strong>?
			</p>
			<div className={styles.actions}>
				<Button
					variant="secondary"
					label={t('keepBasket')}
					onClick={onCancel}
				/>
				<Button label={t('emptyAndStartBasket')} onClick={onConfirm} />
			</div>
		</dialog>
	)
}
