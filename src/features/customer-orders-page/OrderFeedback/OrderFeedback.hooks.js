import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'
import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/customer-orders-page/messages.json'
import { useCallback, useState } from 'react'
import {
	FeedbackAvailabilityError,
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
	useRequestErrorNotification(availability.error, (language) =>
		availability.error instanceof FeedbackAvailabilityError
			? translate(messages, language, 'feedbackAvailabilityFailed')
			: getRequestErrorMessage(availability.error, language),
	)
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
			notify(
				(language) =>
					translate(messages, language, 'thanksForFeedback'),
				'success',
			)
		} catch (error) {
			// This form is only available for delivered orders, a terminal status.
			setSubmission(error.status === 409 ? { isSubmitted: true } : null)
			if (error.status === 409) {
				notify(
					(language) =>
						translate(messages, language, 'feedbackAlreadySent'),
					'warning',
				)
			} else if (error.status !== 401) {
				notify(
					(language) => getRequestErrorMessage(error, language),
					'error',
				)
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
