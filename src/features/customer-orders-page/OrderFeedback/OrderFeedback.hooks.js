import { useCallback, useState } from 'react'
import {
	getOrderFeedbackAvailability,
	submitOrderFeedback,
} from '@/features/customer-orders-page/services/orderFeedbackService.js'
import {
	useNotification,
	useRequestErrorNotification,
} from '@/shared/hooks/useNotification.js'
import { useRequest } from '@/shared/hooks/useRequest.js'

export function useOrderFeedback(orderId) {
	const loadAvailability = useCallback(
		(signal) => getOrderFeedbackAvailability(orderId, signal),
		[orderId],
	)
	const availability = useRequest(loadAvailability)
	useRequestErrorNotification(availability.error)
	const notify = useNotification()
	const [submission, setSubmission] = useState(null)
	const isSubmitting = submission?.isSubmitting === true
	const isSubmitted =
		submission?.isSubmitted === true || availability.data === false

	async function sendFeedback(event) {
		event.preventDefault()
		if (isSubmitting || isSubmitted || availability.data !== true) return

		const fields = new FormData(event.currentTarget)
		setSubmission({ isSubmitting: true })
		try {
			await submitOrderFeedback(orderId, {
				title: fields.get('title').trim() || null,
				description: fields.get('description').trim() || null,
				foodRating: Number(fields.get('foodRating')),
				overallRating: Number(fields.get('overallRating')),
				deliveryRating: Number(fields.get('deliveryRating')),
			})
			setSubmission({ isSubmitted: true })
			notify('Tak for din feedback!', 'success')
		} catch (error) {
			// This form is only available for delivered orders, a terminal status.
			setSubmission(error.status === 409 ? { isSubmitted: true } : null)
			if (error.status === 409) {
				notify(
					'Du har allerede givet feedback på denne ordre.',
					'warning',
				)
			} else if (error.status !== 401) {
				notify(error.message, 'error')
			}
		}
	}

	return {
		availability,
		isSubmitting,
		isSubmitted,
		sendFeedback,
	}
}
