import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import { LoginForm } from '@/features/login-page/index.jsx'

function LoginPage() {
	return (
		<AuthLayout title="Log ind">
			<LoginForm />
		</AuthLayout>
	)
}

export default LoginPage
