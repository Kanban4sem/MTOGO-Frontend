import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import LoginPage from '@/app/pages/LoginPage.jsx'
import RegisterPage from '@/app/pages/RegisterPage.jsx'
import ProfilePage from '@/app/pages/ProfilePage.jsx'
import HomePage from '@/app/pages/HomePage.jsx'
import RestaurantMenuPage from '@/app/pages/RestaurantMenuPage.jsx'
import CheckoutPage from '@/app/pages/CheckoutPage.jsx'
import OrderConfirmationPage from '@/app/pages/OrderConfirmationPage.jsx'
import NotFoundPage from '@/app/pages/NotFoundPage.jsx'
import {
	CHECKOUT_PATH,
	ORDER_CONFIRMATION_ROUTE,
	RESTAURANT_MENU_ROUTE,
} from '@/shared/data/paths.js'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<HomeLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route
						path={RESTAURANT_MENU_ROUTE}
						element={<RestaurantMenuPage />}
					/>
					<Route path={CHECKOUT_PATH} element={<CheckoutPage />} />
					<Route
						path={ORDER_CONFIRMATION_ROUTE}
						element={<OrderConfirmationPage />}
					/>
					<Route path="*" element={<NotFoundPage />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
