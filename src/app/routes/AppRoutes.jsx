import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import DeliveryAgentLayout from '@/app/layouts/DeliveryAgentLayout.jsx'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
import LoginPage from '@/app/pages/LoginPage.jsx'
import RegisterPage from '@/app/pages/RegisterPage.jsx'
import ProfilePage from '@/app/pages/ProfilePage.jsx'
import HomePage from '@/app/pages/HomePage.jsx'
import RestaurantsPage from '@/app/pages/RestaurantsPage.jsx'
import RestaurantMenuPage from '@/app/pages/RestaurantMenuPage.jsx'
import CheckoutPage from '@/app/pages/CheckoutPage.jsx'
import OrderConfirmationPage from '@/app/pages/OrderConfirmationPage.jsx'
import CustomerOrdersPage from '@/app/pages/CustomerOrdersPage.jsx'
import CustomerSettingsPage from '@/app/pages/CustomerSettingsPage.jsx'
import DeliveryOrdersPage from '@/app/pages/DeliveryOrdersPage.jsx'
import RestaurantOrdersPage from '@/app/pages/RestaurantOrdersPage.jsx'
import RestaurantProfilePage from '@/app/pages/RestaurantProfilePage.jsx'
import NotFoundPage from '@/app/pages/NotFoundPage.jsx'
import {
	CHECKOUT_PATH,
	CUSTOMER_ORDERS_PATH,
	CUSTOMER_ORDER_ROUTE,
	CUSTOMER_SETTINGS_PATH,
	DASHBOARD_ORDERS_PATH,
	DASHBOARD_PATH,
	ORDER_CONFIRMATION_ROUTE,
	LOGIN_PATH,
	PROFILE_PATH,
	RESTAURANTS_PATH,
	RESTAURANT_MENU_ROUTE,
	RESTAURANT_ORDERS_PATH,
	RESTAURANT_PROFILE_PATH,
} from '@/shared/data/paths.js'

const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			<Route path={DASHBOARD_PATH} element={<DeliveryAgentLayout />}>
				<Route index element={<DeliveryOrdersPage available />} />
				<Route
					path={DASHBOARD_ORDERS_PATH}
					element={<DeliveryOrdersPage />}
				/>
			</Route>
			<Route element={<HomeLayout />}>
				<Route path="/" element={<HomePage />} />
				<Route path={RESTAURANTS_PATH} element={<RestaurantsPage />} />
				<Route path={PROFILE_PATH} element={<ProfilePage />} />
				<Route
					path={CUSTOMER_SETTINGS_PATH}
					element={<CustomerSettingsPage />}
				/>
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
			<Route path={LOGIN_PATH} element={<LoginPage />} />
			<Route path="/register" element={<RegisterPage />} />
		</>,
	),
)

function AppRoutes() {
	return <RouterProvider router={router} />
}

export default AppRoutes
