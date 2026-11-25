import { Link } from 'react-router-dom'
import { LOGIN_PATH } from '@/shared/data/paths.js'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { REGISTER_STEPS } from '@/features/register-page/RegisterForm/registerFields.js'
import { useRegister } from '@/features/register-page/RegisterForm/RegisterForm.hooks.js'
import styles from '@/features/register-page/RegisterForm/RegisterForm.module.css'

function RegisterForm() {
	const {
		stepIndex,
		headingRef,
		isLastStep,
		submitRegistration,
		goBack,
		error,
		isSubmitting,
		returnTo,
	} = useRegister()

	return (
		<section className={styles.register} aria-labelledby="register-title">
			<h1 id="register-title" ref={headingRef} tabIndex={-1}>
				Opret konto
			</h1>
			<p className={styles.stepIndicator} aria-live="polite">
				Trin {stepIndex + 1} af {REGISTER_STEPS.length} ·{' '}
				{REGISTER_STEPS[stepIndex].label}
			</p>
			{error && <p role="alert">{error}</p>}
			<form
				className={styles.form}
				onSubmit={submitRegistration}
				aria-busy={isSubmitting}
			>
				{REGISTER_STEPS.map(({ name, fields }, index) => (
					<fieldset
						key={name}
						className={styles.step}
						hidden={stepIndex !== index}
						disabled={stepIndex !== index || isSubmitting}
					>
						<legend className={styles.stepLegend}>
							{REGISTER_STEPS[index].label}
						</legend>
						<FormFields fields={fields} />
					</fieldset>
				))}
				<div className={styles.actions}>
					{stepIndex > 0 && (
						<Button
							label="Tilbage"
							onClick={goBack}
							disabled={isSubmitting}
						/>
					)}
					<Button
						label={
							isSubmitting
								? 'Opretter konto…'
								: isLastStep
									? 'Opret konto'
									: 'Gå videre'
						}
						type="submit"
						disabled={isSubmitting}
					/>
				</div>
			</form>
			<p>
				Har du allerede en konto?{' '}
				<Link to={LOGIN_PATH} state={{ returnTo }}>
					Log ind
				</Link>
			</p>
		</section>
	)
}

export default RegisterForm
