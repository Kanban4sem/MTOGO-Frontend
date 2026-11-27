import messages from '@/features/customer-orders-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useOrderFeedback } from '@/features/customer-orders-page/OrderFeedback/OrderFeedback.hooks.js'
import styles from '@/features/customer-orders-page/OrderFeedback/OrderFeedback.module.css'
import Button from '@/shared/components/Button/Button.jsx'
import Input from '@/shared/components/Input/Input.jsx'
import Select from '@/shared/components/Select/Select.jsx'
import { ORDER_FEEDBACK_SECTION_ID } from '@/shared/data/paths.js'

function OrderFeedbackForm({ isSubmitting, sendFeedback }) {
	const t = useTranslations(messages)
	const ratingOptions = [
		{ value: '', label: t('choose'), disabled: true },
		...[1, 2, 3, 4, 5, 6].map((rating) => ({
			value: rating,
			label: rating,
		})),
	]
	return (
		<form onSubmit={sendFeedback}>
			<fieldset className={styles.fields} disabled={isSubmitting}>
				<legend>{t('rateYourOrder')}</legend>
				<div className={styles.ratings}>
					<Select
						label={t('rateFood')}
						name="foodRating"
						options={ratingOptions}
						defaultValue=""
						required
					/>
					<Select
						label={t('rateCourier')}
						name="deliveryRating"
						options={ratingOptions}
						defaultValue=""
						required
					/>
					<Select
						label={t('rateExperience')}
						name="overallRating"
						options={ratingOptions}
						defaultValue=""
						required
					/>
				</div>
				<Input
					label={t('optionalTitle')}
					name="title"
					maxLength={100}
				/>
				<label className={styles.comment}>
					{t('optionalComment')}
					<textarea name="description" rows={4} maxLength={1000} />
				</label>
				<Button
					type="submit"
					label={
						isSubmitting ? t('sendingFeedback') : t('sendFeedback')
					}
				/>
			</fieldset>
		</form>
	)
}

export default function OrderFeedback({ orderId }) {
	const t = useTranslations(messages)
	const section = useRef(null)
	const location = useLocation()
	const { availability, isSubmitting, isSubmitted, sendFeedback } =
		useOrderFeedback(orderId)

	useEffect(() => {
		if (location.hash === `#${ORDER_FEEDBACK_SECTION_ID}`) {
			section.current.focus()
		}
	}, [location])

	return (
		<section
			ref={section}
			id={ORDER_FEEDBACK_SECTION_ID}
			className={styles.feedback}
			aria-labelledby="order-feedback-title"
			tabIndex={-1}
		>
			<h2 id="order-feedback-title">{t('feedback')}</h2>
			{isSubmitted ? (
				<p>{t('feedbackReceived')}</p>
			) : availability.isLoading ? (
				<p role="status">{t('loadingFeedback')}</p>
			) : availability.error ? (
				<Button
					label={t('retry')}
					variant="secondary"
					onClick={availability.reload}
				/>
			) : (
				<OrderFeedbackForm
					isSubmitting={isSubmitting}
					sendFeedback={sendFeedback}
				/>
			)}
		</section>
	)
}
