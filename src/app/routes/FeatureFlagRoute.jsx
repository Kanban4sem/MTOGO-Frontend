import NotFoundPage from '@/app/pages/NotFoundPage.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { useFeatureFlags } from '@/shared/hooks/useFeatureFlags.js'

// A route behind a flag looks as if it does not exist while the flag is off.
// While the flags load it waits, so a refresh doesn't flash the not-found page.
export default function FeatureFlagRoute({
	flag,
	deniedLayout: DeniedLayout = Fragment,
	children,
}) {
	const { isEnabled, isLoading } = useFeatureFlags()
	if (isLoading) return <RequestState title="Indlæser…" isLoading />
	return isEnabled(flag) ? (
		children
	) : (
		<DeniedLayout>
			<NotFoundPage />
		</DeniedLayout>
	)
}
import { Fragment } from 'react'
