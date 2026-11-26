import { useEffect, useRef, useState } from 'react'
import { MaintenanceContext } from '@/shared/context/MaintenanceContext.jsx'
import { getPausedFeatures } from '@/shared/services/maintenanceService.js'

const REFRESH_INTERVAL_MS = 30_000
const REQUEST_TIMEOUT_MS = 10_000

export function MaintenanceProvider({ children }) {
	const [pauses, setPauses] = useState(null)
	const pauseRevision = useRef(0)

	useEffect(() => {
		const controller = new AbortController()
		let timer
		let requestInFlight = false
		let nextCheckAt = 0

		async function refresh() {
			clearTimeout(timer)
			if (document.hidden || requestInFlight) return
			const wait = nextCheckAt - performance.now()
			if (wait > 0) {
				timer = setTimeout(refresh, wait)
				return
			}

			requestInFlight = true
			nextCheckAt = performance.now() + REFRESH_INTERVAL_MS
			const revision = pauseRevision.current
			try {
				const signal = AbortSignal.any([
					controller.signal,
					AbortSignal.timeout(REQUEST_TIMEOUT_MS),
				])
				const nextPauses = await getPausedFeatures(signal)
				// A pause reported by a submission is newer than a check already in flight.
				if (
					!controller.signal.aborted &&
					revision === pauseRevision.current
				) {
					setPauses(nextPauses)
				}
			} catch {
				// Keep the last confirmed status if a refresh fails.
				if (!controller.signal.aborted)
					setPauses((previous) => previous ?? {})
			} finally {
				requestInFlight = false
				if (!controller.signal.aborted && !document.hidden) {
					timer = setTimeout(
						refresh,
						Math.max(0, nextCheckAt - performance.now()),
					)
				}
			}
		}

		timer = setTimeout(refresh, 0)
		document.addEventListener('visibilitychange', refresh)
		return () => {
			controller.abort()
			clearTimeout(timer)
			document.removeEventListener('visibilitychange', refresh)
		}
	}, [])

	function recordPause(error) {
		const feature = error.maintenanceFeature
		if (!feature) return false
		pauseRevision.current += 1
		setPauses((previous) => ({ ...previous, [feature]: true }))
		return true
	}

	return (
		<MaintenanceContext.Provider
			value={{
				isLoading: pauses === null,
				pauses: pauses ?? {},
				recordPause,
			}}
		>
			{children}
		</MaintenanceContext.Provider>
	)
}
