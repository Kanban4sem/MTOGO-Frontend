import { client } from '@/api/client.js'

export function getMaintenanceStatus(signal) {
	return client('/maintenance', { authenticated: false, signal })
}
