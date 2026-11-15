// Pathing
// _______
// src/features/login-page/login/Login.jsx

import { Link } from 'react-router-dom'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { LOGIN_FIELDS } from './loginFields.js'
import { useLogin } from './Login.hooks.js'
import styles from './Login.module.css'

function Login() {
	const { error, isSubmitting, handleSubmit, registered, initialEmail } =
		useLogin()

	return (
		<section className={styles.login} aria-labelledby="login-title">
			<h1 id="login-title">Log ind</h1>
			{error && <p role="alert">{error}</p>}
			{registered && (
				<p role="status">Din konto er oprettet. Du kan nu logge ind.</p>
			)}
			<form
				className={styles.form}
				onSubmit={handleSubmit}
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
				Har du ikke en konto? <Link to="/register">Opret en konto</Link>
			</p>
		</section>
	)
}

export default Login
