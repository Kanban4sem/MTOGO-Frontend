import { Outlet } from 'react-router-dom'
import NavBar from '@/shared/components/nav-bar/NavBar.jsx'

function HomeLayout() {
	return (
		<>
			<NavBar />
			<main>
				<Outlet />
			</main>
		</>
	)
}

export default HomeLayout
