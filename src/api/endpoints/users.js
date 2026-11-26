import { client } from '@/api/client.js'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'

export function registerUser(registration) {
	return client('/users', {
		method: 'POST',
		authenticated: false,
		maintenanceFeature: MAINTENANCE_FEATURES.AUTHENTICATION,
		body: JSON.stringify(registration),
	})
}

export function loginUser(credentials) {
	return client('/users/login', {
		method: 'POST',
		authenticated: false,
		maintenanceFeature: MAINTENANCE_FEATURES.AUTHENTICATION,
		body: JSON.stringify(credentials),
	})
}

export function getCurrentUser(signal) {
	return client('/users/me', { signal })
}

export function updateCurrentUser(profile, signal) {
	return client('/users/me', {
		method: 'PUT',
		body: JSON.stringify(profile),
		signal,
	})
}

export function logoutUser() {
	return client('/users/logout', { method: 'POST' })
}
