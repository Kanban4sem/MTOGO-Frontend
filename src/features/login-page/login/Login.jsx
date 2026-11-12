import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

const Login = () => {
  const { isEnabled } = useFeatureFlags()

  return <p>loginEnabled: {String(isEnabled('loginEnabled'))}</p>
}

export default Login
