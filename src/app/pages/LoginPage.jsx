import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import { LoginCard } from '@/features/login-page/index.jsx'

function LoginPage() {
	return (
		<AuthLayout title="Log ind">
			<LoginCard />
		</AuthLayout>
	)
}

export default LoginPage
