import { Helmet, HelmetProvider } from 'react-helmet-async'
import AppRoutes from '@/app/routes/AppRoutes.jsx'

function App() {
	return (
		<HelmetProvider>
			<Helmet defaultTitle="MTOGO" titleTemplate="%s | MTOGO" />
			<AppRoutes />
		</HelmetProvider>
	)
}

export default App
