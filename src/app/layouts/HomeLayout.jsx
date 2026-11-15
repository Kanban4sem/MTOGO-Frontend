import { Outlet } from 'react-router-dom'
import NavBar from '@/shared/components/nav-bar/NavBar.jsx'
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
					<a className={styles.footerBrand} href="/">
						MTOGO<span>.</span>
					</a>
					<p>God mad. Gode øjeblikke.</p>
					<span>Et godt måltid er kun et kig væk.</span>
				</footer>
			</div>
		</>
	)
}
