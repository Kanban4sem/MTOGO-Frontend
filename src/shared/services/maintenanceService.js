import { getMaintenanceStatus } from '@/api/endpoints/maintenance.js'

export async function getPausedFeatures(signal) {
	const statuses = await getMaintenanceStatus(signal)
	return Object.fromEntries(
		statuses
			.filter(({ paused }) => paused === true)
			.map(({ feature }) => [feature, true]),
	)
}
