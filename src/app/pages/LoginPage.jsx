// Pathing
// _______
// src/app/pages/LoginPage.jsx

import { LoginCard } from '@/features/login-page/index.jsx'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

function LoginPage() {
  const { isEnabled } = useFeatureFlags()

  // FeatureFlag Guard
  if (!isEnabled('loginEnabled')) {
    return <p>Login er ikke tilgængeligt lige nu.</p>
  }

  return <LoginCard />
}

export default LoginPage
