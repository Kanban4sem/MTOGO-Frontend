// Pathing
// _______
// src/shared/hooks/useFeatureFlags.js

import { useContext } from 'react'
import { FeatureFlagsContext } from '@/shared/context/FeatureFlagsContext.jsx'

export function useFeatureFlags() {
  const flags = useContext(FeatureFlagsContext)

  if (flags === null) {
    throw new Error('useFeatureFlags must be used within FeatureFlagsProvider')
  }

  function isEnabled(flagName) {
    return flags[flagName] === true
  }

  return { isEnabled }
}
