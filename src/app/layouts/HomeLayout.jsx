import { Link, Outlet } from 'react-router-dom'
import NavBar from '@/shared/components/NavBar/NavBar.jsx'

export default function HomeLayout({ children }) {
	return (
		<>
			<a className="homeSkipLink" href="#main">
				Gå til indhold
			</a>
			<NavBar />
			<div className="homeLayout">
				<main id="main">{children ?? <Outlet />}</main>
				<footer className="homeFooter">
					<Link className="homeFooterBrand" to="/">
						MTOGO<span>.</span>
					</Link>
					<p>God mad. Gode øjeblikke.</p>
					<span>Et godt måltid er kun et kig væk.</span>
				</footer>
			</div>
		</>
	)
}
