import { Link } from 'react-router-dom'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { useNotificationMessage } from '@/shared/hooks/useNotification.js'
import { LOGIN_FIELDS } from '@/features/login-page/LoginForm/loginFields.js'
import { useLogin } from '@/features/login-page/LoginForm/LoginForm.hooks.js'
import styles from '@/features/login-page/LoginForm/LoginForm.module.css'

function LoginForm() {
	const {
		isSubmitting,
		submitLogin,
		returnTo,
		sessionExpired,
		initialEmail,
	} = useLogin()
	useNotificationMessage(
		sessionExpired ? 'Din session er udløbet. Log ind igen.' : '',
		'warning',
	)

	return (
		<section className={styles.login} aria-labelledby="login-title">
			<h1 id="login-title">Log ind</h1>
			<form
				className={styles.form}
				onSubmit={submitLogin}
				aria-busy={isSubmitting}
			>
				<FormFields
					fields={LOGIN_FIELDS.map((field) => ({
						...field,
						disabled: isSubmitting,
						...(field.name === 'email' && {
							defaultValue: initialEmail,
						}),
					}))}
				/>
				<Button
					label={isSubmitting ? 'Logger ind…' : 'Log ind'}
					type="submit"
					disabled={isSubmitting}
				/>
			</form>
			<p>
				Har du ikke en konto?{' '}
				<Link to="/register" state={{ returnTo }}>
					Opret en konto
				</Link>
			</p>
		</section>
	)
}

export default LoginForm
