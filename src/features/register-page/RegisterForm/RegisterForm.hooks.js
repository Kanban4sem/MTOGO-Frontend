import { useRef, useState } from 'react'
import { LOGIN_PATH } from '@/shared/data/paths.js'
import { useLocation, useNavigate } from 'react-router-dom'
import { registerAccount } from '@/shared/services/userService.js'
import { getAuthErrorMessage } from '@/shared/utils/authErrors.js'
import { REGISTER_STEPS } from '@/features/register-page/RegisterForm/registerFields.js'

export function useRegister() {
	const navigate = useNavigate()
	const { state: navigation } = useLocation()
	// The address login should return to, kept through registration.
	const returnTo = navigation?.returnTo
	const [stepIndex, setStepIndex] = useState(0)
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const registrationRef = useRef({})
	const headingRef = useRef(null)
	const isLastStep = stepIndex === REGISTER_STEPS.length - 1

	function changeStep(nextStepIndex) {
		setStepIndex(nextStepIndex)
		headingRef.current?.focus()
	}

	async function submitRegistration(event) {
		event.preventDefault()
		if (isSubmitting) return
		setError('')
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
				setError('De to passwords skal være ens.')
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
			setError(
				'Udfyld både postnummer, by og land, eller lad hele adressen være tom.',
			)
			return
		}

		setIsSubmitting(true)
		try {
			await registerAccount(registration)
			registrationRef.current = {}
			navigate(LOGIN_PATH, {
				replace: true,
				state: {
					registered: true,
					email: registration.email,
					returnTo,
				},
			})
		} catch (error) {
			setError(getAuthErrorMessage(error))
			if (error.status === 409) changeStep(0)
		} finally {
			setIsSubmitting(false)
		}
	}

	function goBack() {
		if (stepIndex > 0 && !isSubmitting) {
			setError('')
			changeStep(stepIndex - 1)
		}
	}

	return {
		stepIndex,
		headingRef,
		isLastStep,
		submitRegistration,
		goBack,
		error,
		isSubmitting,
		returnTo,
	}
}
