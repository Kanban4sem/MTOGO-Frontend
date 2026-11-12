// Pathing
// _______
// src/shared/context/FeatureFlagsProvider.jsx

import { useEffect, useState } from 'react'
import { getFeatureFlags } from '@/api/endpoints/featureFlags.js'
import { FeatureFlagsContext } from '@/shared/context/FeatureFlagsContext.jsx'

let startupRequest

function loadStartupFlags() {
  startupRequest ??= getFeatureFlags().catch(() => ({}))
  return startupRequest
}

export function FeatureFlagsProvider({ children }) {
  const [flags, setFlags] = useState({})

  useEffect(() => {
    let active = true

    loadStartupFlags().then((loadedFlags) => {
      if (active) {
        setFlags(loadedFlags ?? {})
      }
    })

    return () => {
      active = false
    }
  }, [])

  return (
    <FeatureFlagsContext.Provider value={flags}>
      {children}
    </FeatureFlagsContext.Provider>
  )
}
