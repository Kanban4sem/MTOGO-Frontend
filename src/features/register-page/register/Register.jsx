// Pathing
// _______
// src/features/register-page/register/Register.jsx

import { Link } from 'react-router-dom'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { REGISTER_STEPS } from './registerFields.js'
import { useRegister } from './Register.hooks.js'
import styles from './Register.module.css'

function Register() {
	const { stepIndex, headingRef, isLastStep, handleSubmit, goBack } =
		useRegister()

	return (
		<section className={styles.register} aria-labelledby="register-title">
			<h1 id="register-title" ref={headingRef} tabIndex={-1}>
				Opret konto
			</h1>
			<p className={styles.stepIndicator} aria-live="polite">
				Trin {stepIndex + 1} af {REGISTER_STEPS.length} ·{' '}
				{REGISTER_STEPS[stepIndex].label}
			</p>
			<form className={styles.form} onSubmit={handleSubmit}>
				{REGISTER_STEPS.map(({ name, fields }, index) => (
					<div
						key={name}
						className={styles.step}
						hidden={stepIndex !== index}
					>
						<FormFields fields={fields} />
					</div>
				))}
				<div className={styles.actions}>
					{stepIndex > 0 && (
						<Button label="Tilbage" onClick={goBack} />
					)}
					<Button
						label={isLastStep ? 'Opret konto' : 'Gå videre'}
						type="submit"
					/>
				</div>
			</form>
			<p>
				Har du allerede en konto? <Link to="/login">Log ind</Link>
			</p>
		</section>
	)
}

export default Register
