import messages from '@/features/register-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import { RegisterForm } from '@/features/register-page/index.jsx'

function RegisterPage() {
	const t = useTranslations(messages)
	return (
		<AuthLayout title={t('createAccount')}>
			<RegisterForm />
		</AuthLayout>
	)
}

export default RegisterPage
