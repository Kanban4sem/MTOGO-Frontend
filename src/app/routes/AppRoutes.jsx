// Pathing
// _______
// src/app/routes/AppRoutes.jsx

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import LoginPage from '@/app/pages/LoginPage.jsx'
import RegisterPage from '@/app/pages/RegisterPage.jsx'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				{/* Auth (Register, Login, Forgotten etc) */}
				<Route element={<AuthLayout />}>
					<Route path="/" element={<LoginPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
