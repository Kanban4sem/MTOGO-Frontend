import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useOrderFeedback } from '@/features/customer-orders-page/OrderFeedback/OrderFeedback.hooks.js'
import styles from '@/features/customer-orders-page/OrderFeedback/OrderFeedback.module.css'
import Button from '@/shared/components/Button/Button.jsx'
import Input from '@/shared/components/Input/Input.jsx'
import Select from '@/shared/components/Select/Select.jsx'
import { ORDER_FEEDBACK_SECTION_ID } from '@/shared/data/paths.js'

const RATING_OPTIONS = [
	{ value: '', label: 'Vælg', disabled: true },
	...[1, 2, 3, 4, 5, 6].map((rating) => ({ value: rating, label: rating })),
]

function OrderFeedbackForm({ isSubmitting, error, sendFeedback }) {
	return (
		<form onSubmit={sendFeedback}>
			<fieldset className={styles.fields} disabled={isSubmitting}>
				<legend>Vurder din ordre</legend>
				<div className={styles.ratings}>
					<Select
						label="Maden"
						name="foodRating"
						options={RATING_OPTIONS}
						defaultValue=""
						required
					/>
					<Select
						label="Buddet"
						name="deliveryRating"
						options={RATING_OPTIONS}
						defaultValue=""
						required
					/>
					<Select
						label="Den samlede oplevelse"
						name="overallRating"
						options={RATING_OPTIONS}
						defaultValue=""
						required
					/>
				</div>
				<Input label="Titel (valgfri)" name="title" maxLength={100} />
				<label className={styles.comment}>
					Kommentar (valgfri)
					<textarea name="description" rows={4} maxLength={1000} />
				</label>
				{error && (
					<p className={styles.error} role="alert">
						{error.message}
					</p>
				)}
				<Button
					type="submit"
					label={isSubmitting ? 'Sender feedback…' : 'Send feedback'}
				/>
			</fieldset>
		</form>
	)
}

export default function OrderFeedback({ orderId }) {
	const section = useRef(null)
	const location = useLocation()
	const {
		availability,
		isSubmitting,
		isSubmitted,
		submitError,
		sendFeedback,
	} = useOrderFeedback(orderId)

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
			<h2 id="order-feedback-title">Feedback</h2>
			{isSubmitted ? (
				<p role="status">
					Du har allerede givet feedback på denne ordre.
				</p>
			) : availability.isLoading ? (
				<p role="status">Henter feedbackstatus…</p>
			) : availability.error ? (
				<>
					<p className={styles.error} role="alert">
						{availability.error.message}
					</p>
					<Button
						label="Prøv igen"
						variant="secondary"
						onClick={availability.reload}
					/>
				</>
			) : (
				<OrderFeedbackForm
					isSubmitting={isSubmitting}
					error={submitError}
					sendFeedback={sendFeedback}
				/>
			)}
		</section>
	)
}
