import messages from '@/features/login-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import { LoginForm } from '@/features/login-page/index.jsx'

function LoginPage() {
	const t = useTranslations(messages)
	return (
		<AuthLayout title={t('login')}>
			<LoginForm />
		</AuthLayout>
	)
}

export default LoginPage
