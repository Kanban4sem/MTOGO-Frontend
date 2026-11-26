import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/globals.css'
import { FeatureFlagsProvider } from '@/shared/context/FeatureFlagsProvider.jsx'
import { MaintenanceProvider } from '@/shared/context/MaintenanceProvider.jsx'
import { AuthProvider } from '@/shared/context/AuthProvider.jsx'
import { BasketProvider } from '@/shared/context/BasketProvider.jsx'
import { NotificationProvider } from '@/shared/context/NotificationProvider.jsx'
import App from '@/app/App.jsx'

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<FeatureFlagsProvider>
			<MaintenanceProvider>
				<AuthProvider>
					<NotificationProvider>
						<BasketProvider>
							<App />
						</BasketProvider>
					</NotificationProvider>
				</AuthProvider>
			</MaintenanceProvider>
		</FeatureFlagsProvider>
	</StrictMode>,
)
