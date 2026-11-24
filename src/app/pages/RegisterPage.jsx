import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import { RegisterCard } from '@/features/register-page/index.jsx'

function RegisterPage() {
	return (
		<AuthLayout title="Opret konto">
			<RegisterCard />
		</AuthLayout>
	)
}

export default RegisterPage
