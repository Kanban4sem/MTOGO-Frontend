import { Link, Outlet } from 'react-router-dom'
import NavBar from '@/shared/components/NavBar/NavBar.jsx'
import styles from './HomeLayout.module.css'

export default function HomeLayout({ children }) {
	return (
		<>
			<a className={styles.skipLink} href="#main">
				Gå til indhold
			</a>
			<NavBar />
			<div className={styles.layout}>
				<main id="main">{children ?? <Outlet />}</main>
				<footer className={styles.footer}>
					<Link className={styles.footerBrand} to="/">
						MTOGO<span>.</span>
					</Link>
					<p>God mad. Gode øjeblikke.</p>
					<span>Et godt måltid er kun et kig væk.</span>
				</footer>
			</div>
		</>
	)
}
