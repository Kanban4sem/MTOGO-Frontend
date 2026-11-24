import { client } from '@/api/client.js'

export function getFeatureFlags() {
	return client('/features', { authenticated: false })
}
