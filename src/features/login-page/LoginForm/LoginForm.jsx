import { translate } from '@/shared/i18n/translate.js'
import messages from '@/features/login-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import { useNotificationMessage } from '@/shared/hooks/useNotification.js'
import { LOGIN_FIELDS } from '@/features/login-page/LoginForm/loginFields.js'
import { useLogin } from '@/features/login-page/LoginForm/LoginForm.hooks.js'
import styles from '@/features/login-page/LoginForm/LoginForm.module.css'

function LoginForm() {
	const t = useTranslations(messages)
	const {
		isSubmitting,
		submitLogin,
		returnTo,
		sessionExpired,
		initialEmail,
	} = useLogin()
	useNotificationMessage(
		sessionExpired,
		(language) => translate(messages, language, 'sessionExpired'),
		'warning',
	)

	return (
		<section className={styles.login} aria-labelledby="login-title">
			<h1 id="login-title">{t('login')}</h1>
			<form
				className={styles.form}
				onSubmit={submitLogin}
				aria-busy={isSubmitting}
			>
				<FormFields
					fields={LOGIN_FIELDS.map(({ labelKey, ...field }) => ({
						...field,
						label: t(labelKey),
						disabled: isSubmitting,
						...(field.name === 'email' && {
							defaultValue: initialEmail,
						}),
					}))}
				/>
				<Button
					label={isSubmitting ? t('loggingIn') : t('login')}
					type="submit"
					disabled={isSubmitting}
				/>
			</form>
			<p>
				{t('noAccount')}{' '}
				<Link to="/register" state={{ returnTo }}>
					{t('createAnAccount')}
				</Link>
			</p>
		</section>
	)
}

export default LoginForm
