import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/shared/styles/globals.css'
import { FeatureFlagsProvider } from '@/shared/context/FeatureFlagsProvider.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FeatureFlagsProvider>
      <App />
    </FeatureFlagsProvider>
  </StrictMode>,
)
