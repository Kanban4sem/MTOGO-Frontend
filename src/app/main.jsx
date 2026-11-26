import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/globals.css'
import { FeatureFlagsProvider } from '@/shared/context/FeatureFlagsProvider.jsx'
import { AuthProvider } from '@/shared/context/AuthProvider.jsx'
import { BasketProvider } from '@/shared/context/BasketProvider.jsx'
import { NotificationProvider } from '@/shared/context/NotificationProvider.jsx'
import App from '@/app/App.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<FeatureFlagsProvider>
			<AuthProvider>
				<NotificationProvider>
					<BasketProvider>
						<App />
					</BasketProvider>
				</NotificationProvider>
			</AuthProvider>
		</FeatureFlagsProvider>
	</StrictMode>,
)
