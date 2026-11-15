// Pathing
// _______
// src/app/routes/AppRoutes.jsx

import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import LoginPage from '@/app/pages/LoginPage.jsx'
import RegisterPage from '@/app/pages/RegisterPage.jsx'
import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import HomePage from '@/app/pages/HomePage.jsx'
import ProfilePage from '@/app/pages/ProfilePage.jsx'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<HomeLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/profile" element={<ProfilePage />} />
				</Route>
				{/* Auth (Register, Login, Forgotten etc) */}
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
