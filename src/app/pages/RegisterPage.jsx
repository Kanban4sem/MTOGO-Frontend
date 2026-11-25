import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import { RegisterForm } from '@/features/register-page/index.jsx'

function RegisterPage() {
	return (
		<AuthLayout title="Opret konto">
			<RegisterForm />
		</AuthLayout>
	)
}

export default RegisterPage
