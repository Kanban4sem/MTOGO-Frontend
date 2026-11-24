import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/globals.css'
import { FeatureFlagsProvider } from '@/shared/context/FeatureFlagsProvider.jsx'
import { AuthProvider } from '@/shared/context/AuthProvider.jsx'
import { BasketProvider } from '@/shared/context/BasketProvider.jsx'
import App from '@/app/App.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<FeatureFlagsProvider>
			<AuthProvider>
				<BasketProvider>
					<App />
				</BasketProvider>
			</AuthProvider>
		</FeatureFlagsProvider>
	</StrictMode>,
)
