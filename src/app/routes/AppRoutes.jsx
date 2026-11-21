import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginPage from '@/app/pages/LoginPage.jsx'
import RegisterPage from '@/app/pages/RegisterPage.jsx'
import ProfilePage from '@/app/pages/ProfilePage.jsx'
import HomePage from '@/app/pages/HomePage.jsx'
import RestaurantMenuPage from '@/app/pages/RestaurantMenuPage.jsx'
import CheckoutPage from '@/app/pages/CheckoutPage.jsx'
import OrderConfirmationPage from '@/app/pages/OrderConfirmationPage.jsx'
import CustomerOrdersPage from '@/app/pages/CustomerOrdersPage.jsx'
import RestaurantOrdersPage from '@/app/pages/RestaurantOrdersPage.jsx'
import RestaurantProfilePage from '@/app/pages/RestaurantProfilePage.jsx'
import NotFoundPage from '@/app/pages/NotFoundPage.jsx'
import {
	CHECKOUT_PATH,
	CUSTOMER_ORDERS_PATH,
	CUSTOMER_ORDER_ROUTE,
	ORDER_CONFIRMATION_ROUTE,
	RESTAURANT_MENU_ROUTE,
	RESTAURANT_ORDERS_PATH,
	RESTAURANT_PROFILE_PATH,
} from '@/shared/data/paths.js'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<HomeLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route
						path={RESTAURANT_ORDERS_PATH}
						element={<RestaurantOrdersPage />}
					/>
					<Route
						path={RESTAURANT_PROFILE_PATH}
						element={<RestaurantProfilePage />}
					/>
					<Route
						path={CUSTOMER_ORDERS_PATH}
						element={<CustomerOrdersPage />}
					/>
					<Route
						path={CUSTOMER_ORDER_ROUTE}
						element={<CustomerOrdersPage />}
					/>
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
				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default AppRoutes
