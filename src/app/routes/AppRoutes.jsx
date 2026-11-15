import HomeLayout from '@/app/layouts/HomeLayout.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from '@/app/layouts/AuthLayout.jsx'
import LoginPage from '@/app/pages/LoginPage.jsx'
import RegisterPage from '@/app/pages/RegisterPage.jsx'
import ProfilePage from '@/app/pages/ProfilePage.jsx'
import HomePage from '@/app/pages/HomePage.jsx'
import RestaurantMenuPage from '@/app/pages/RestaurantMenuPage.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'

function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<HomeLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/profile" element={<ProfilePage />} />
					<Route
						path="/restaurant/:restaurantId/menu"
						element={<RestaurantMenuPage />}
					/>
					<Route
						path="*"
						element={
							<RequestState title="Denne side er ikke på menuen">
								<a href="/">Gå tilbage til forsiden</a>
							</RequestState>
						}
					/>
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
