import { client } from '@/api/client.js'

export function registerUser(registration) {
	return client('/users', {
		method: 'POST',
		authenticated: false,
		body: JSON.stringify(registration),
	})
}

export function loginUser(credentials) {
	return client('/users/login', {
		method: 'POST',
		authenticated: false,
		body: JSON.stringify(credentials),
	})
}

export function getCurrentUser() {
	return client('/users/me')
}

export function logoutUser() {
	return client('/users/logout', { method: 'POST' })
}
