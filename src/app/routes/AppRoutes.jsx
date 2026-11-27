import messages from '@/app/routes/AppRoutes.messages.json'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import DeliveryAgentLayout from '@/app/layouts/DeliveryAgentLayout.jsx'
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom'
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

function loadPage(importPage) {
	return async () => ({ Component: (await importPage()).default })
}

const loadLoginPage = loadPage(() => import('@/app/pages/LoginPage.jsx'))
const loadRegisterPage = loadPage(() => import('@/app/pages/RegisterPage.jsx'))
const loadProfilePage = loadPage(() => import('@/app/pages/ProfilePage.jsx'))
const loadHomePage = loadPage(() => import('@/app/pages/HomePage.jsx'))
const loadRestaurantsPage = loadPage(
	() => import('@/app/pages/RestaurantsPage.jsx'),
)
const loadRestaurantMenuPage = loadPage(
	() => import('@/app/pages/RestaurantMenuPage.jsx'),
)
const loadCheckoutPage = loadPage(() => import('@/app/pages/CheckoutPage.jsx'))
const loadOrderConfirmationPage = loadPage(
	() => import('@/app/pages/OrderConfirmationPage.jsx'),
)
const loadCustomerOrdersPage = loadPage(
	() => import('@/app/pages/CustomerOrdersPage.jsx'),
)
const loadCustomerSettingsPage = loadPage(
	() => import('@/app/pages/CustomerSettingsPage.jsx'),
)
const loadDeliveryOrdersPage = loadPage(
	() => import('@/app/pages/DeliveryOrdersPage.jsx'),
)
const loadRestaurantOrdersPage = loadPage(
	() => import('@/app/pages/RestaurantOrdersPage.jsx'),
)
const loadRestaurantProfilePage = loadPage(
	() => import('@/app/pages/RestaurantProfilePage.jsx'),
)
const loadNotFoundPage = loadPage(() => import('@/app/pages/NotFoundPage.jsx'))

async function loadAvailableDeliveryOrders() {
	const { default: DeliveryOrdersPage } =
		await import('@/app/pages/DeliveryOrdersPage.jsx')
	return { Component: () => <DeliveryOrdersPage available /> }
}

function AppLoading() {
	const t = useTranslations(messages)
	return <RequestState title={t('loadingPage')} isLoading />
}

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route HydrateFallback={AppLoading}>
			<Route path={DASHBOARD_PATH} element={<DeliveryAgentLayout />}>
				<Route index lazy={loadAvailableDeliveryOrders} />
				<Route
					path={DASHBOARD_ORDERS_PATH}
					lazy={loadDeliveryOrdersPage}
				/>
			</Route>
			<Route element={<HomeLayout />}>
				<Route path="/" lazy={loadHomePage} />
				<Route path={RESTAURANTS_PATH} lazy={loadRestaurantsPage} />
				<Route path={PROFILE_PATH} lazy={loadProfilePage} />
				<Route
					path={CUSTOMER_SETTINGS_PATH}
					lazy={loadCustomerSettingsPage}
				/>
				<Route
					path={RESTAURANT_ORDERS_PATH}
					lazy={loadRestaurantOrdersPage}
				/>
				<Route
					path={RESTAURANT_PROFILE_PATH}
					lazy={loadRestaurantProfilePage}
				/>
				<Route
					path={CUSTOMER_ORDERS_PATH}
					lazy={loadCustomerOrdersPage}
				/>
				<Route
					path={CUSTOMER_ORDER_ROUTE}
					lazy={loadCustomerOrdersPage}
				/>
				<Route
					path={RESTAURANT_MENU_ROUTE}
					lazy={loadRestaurantMenuPage}
				/>
				<Route path={CHECKOUT_PATH} lazy={loadCheckoutPage} />
				<Route
					path={ORDER_CONFIRMATION_ROUTE}
					lazy={loadOrderConfirmationPage}
				/>
				<Route path="*" lazy={loadNotFoundPage} />
			</Route>
			<Route path={LOGIN_PATH} lazy={loadLoginPage} />
			<Route path="/register" lazy={loadRegisterPage} />
		</Route>,
	),
)

function AppRoutes() {
	return <RouterProvider router={router} />
}

export default AppRoutes
