import { useState } from 'react'
import FeatureUnavailable from '@/shared/components/FeatureUnavailable/FeatureUnavailable.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import { useMaintenance } from '@/shared/hooks/useMaintenance.js'

export default function MaintenanceGate({
	feature,
	keepOpenOnPause = false,
	children,
}) {
	const { pauses, isLoading } = useMaintenance()
	const [hasOpened, setHasOpened] = useState(false)
	const isPaused = pauses[feature] === true
	if (keepOpenOnPause && !hasOpened && !isLoading && !isPaused) {
		setHasOpened(true)
	}
	if (isPaused && !hasOpened) return <FeatureUnavailable feature={feature} />
	if (isLoading)
		return <RequestState title="Vi tjekker tilgængeligheden…" isLoading />
	return children
}
