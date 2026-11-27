import messages from '@/features/register-page/messages.json'
import { useLanguage } from '@/shared/i18n/useLanguage.js'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import { LOGIN_PATH } from '@/shared/data/paths.js'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { getRegisterSteps } from '@/features/register-page/RegisterForm/registerFields.js'
import { useRegister } from '@/features/register-page/RegisterForm/RegisterForm.hooks.js'
import styles from '@/features/register-page/RegisterForm/RegisterForm.module.css'

function RegisterForm() {
	const t = useTranslations(messages)
	const { language } = useLanguage()
	const steps = getRegisterSteps(t, language)
	const {
		stepIndex,
		headingRef,
		isLastStep,
		submitRegistration,
		goBack,
		isSubmitting,
		returnTo,
	} = useRegister(steps.length)

	return (
		<section className={styles.register} aria-labelledby="register-title">
			<h1 id="register-title" ref={headingRef} tabIndex={-1}>
				{t('createAccount')}
			</h1>
			<p className={styles.stepIndicator} aria-live="polite">
				{t('step')} {stepIndex + 1} {t('stepOf')} {steps.length} ·{' '}
				{steps[stepIndex].label}
			</p>
			<form
				className={styles.form}
				onSubmit={submitRegistration}
				aria-busy={isSubmitting}
			>
				{steps.map(({ name, fields }, index) => (
					<fieldset
						key={name}
						className={styles.step}
						hidden={stepIndex !== index}
						disabled={stepIndex !== index || isSubmitting}
					>
						<legend className={styles.stepLegend}>
							{steps[index].label}
						</legend>
						<FormFields fields={fields} />
					</fieldset>
				))}
				<div className={styles.actions}>
					{stepIndex > 0 && (
						<Button
							label={t('back')}
							onClick={goBack}
							disabled={isSubmitting}
						/>
					)}
					<Button
						label={
							isSubmitting
								? t('creatingAccount')
								: isLastStep
									? t('createAccount')
									: t('continue')
						}
						type="submit"
						disabled={isSubmitting}
					/>
				</div>
			</form>
			<p>
				{t('alreadyHaveAccount')}{' '}
				<Link to={LOGIN_PATH} state={{ returnTo }}>
					{t('login')}
				</Link>
			</p>
		</section>
	)
}

export default RegisterForm
