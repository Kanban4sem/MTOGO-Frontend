// Pathing
// _______
// src/features/register-page/register/Register.hooks.js

import { useRef, useState } from 'react'
import { REGISTER_STEPS } from './registerFields.js'

export function useRegister() {
	const [stepIndex, setStepIndex] = useState(0)
	const headingRef = useRef(null)
	const isLastStep = stepIndex === REGISTER_STEPS.length - 1

	function changeStep(nextStepIndex) {
		setStepIndex(nextStepIndex)
		headingRef.current?.focus()
	}

	function handleSubmit(event) {
		event.preventDefault()
		if (!isLastStep) {
			changeStep(stepIndex + 1)
		}
	}

	function goBack() {
		if (stepIndex > 0) {
			changeStep(stepIndex - 1)
		}
	}

	return { stepIndex, headingRef, isLastStep, handleSubmit, goBack }
}
