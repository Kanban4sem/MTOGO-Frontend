// Pathing
// _______
// src/shared/hooks/useFeatureFlags.js

import { useContext } from 'react'
import { FeatureFlagsContext } from '@/shared/context/FeatureFlagsContext.jsx'

export function useFeatureFlags() {
	const context = useContext(FeatureFlagsContext)

	if (context === null) {
		throw new Error(
			'useFeatureFlags must be used within FeatureFlagsProvider',
		)
	}

	function isEnabled(flagName) {
		return context.flags[flagName] === true
	}

	return { isEnabled, isLoading: context.isLoading }
}
