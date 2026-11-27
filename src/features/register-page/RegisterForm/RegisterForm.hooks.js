import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/register-page/messages.json'
import { useRef, useState } from 'react'
import { LOGIN_PATH } from '@/shared/data/paths.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { useNotification } from '@/shared/hooks/useNotification.js'
import { useMaintenance } from '@/shared/hooks/useMaintenance.js'
import { registerAccount } from '@/shared/services/userService.js'
import { getAuthErrorMessage } from '@/shared/utils/authErrors.js'

export function useRegister(stepCount) {
	const navigate = useNavigate()
	const { state: navigation } = useLocation()
	// The address login should return to, kept through registration.
	const returnTo = navigation?.returnTo
	const [stepIndex, setStepIndex] = useState(0)
	const notify = useNotification()
	const { recordPause } = useMaintenance()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const registrationRef = useRef({})
	const headingRef = useRef(null)
	const isLastStep = stepIndex === stepCount - 1

	function changeStep(nextStepIndex) {
		setStepIndex(nextStepIndex)
		headingRef.current?.focus()
	}

	async function submitRegistration(event) {
		event.preventDefault()
		if (isSubmitting) return
		const fields = Object.fromEntries(new FormData(event.currentTarget))
		for (const name of Object.keys(fields)) {
			if (name !== 'password' && name !== 'confirmPassword') {
				fields[name] = fields[name].trim()
			}
		}
		const registration = { ...registrationRef.current, ...fields }
		registrationRef.current = registration

		if (!isLastStep) {
			if (registration.password !== registration.confirmPassword) {
				notify(
					(language) =>
						translate(messages, language, 'passwordsMustMatch'),
					'warning',
				)
				return
			}
			changeStep(stepIndex + 1)
			return
		}

		const address = [
			registration.postalCode,
			registration.city,
			registration.country,
		]
		if (address.some(Boolean) && !address.every(Boolean)) {
			notify(
				(language) => translate(messages, language, 'completeAddress'),
				'warning',
			)
			return
		}

		setIsSubmitting(true)
		try {
			await registerAccount(registration)
			registrationRef.current = {}
			notify(
				(language) => translate(messages, language, 'accountCreated'),
				'success',
			)
			navigate(LOGIN_PATH, {
				replace: true,
				state: {
					email: registration.email,
					returnTo,
				},
			})
		} catch (error) {
			if (recordPause(error)) return
			notify((language) => getAuthErrorMessage(error, language), 'error')
			if (error.status === 409) changeStep(0)
		} finally {
			setIsSubmitting(false)
		}
	}

	function goBack() {
		if (stepIndex > 0 && !isSubmitting) {
			changeStep(stepIndex - 1)
		}
	}

	return {
		stepIndex,
		headingRef,
		isLastStep,
		submitRegistration,
		goBack,
		isSubmitting,
		returnTo,
	}
}
