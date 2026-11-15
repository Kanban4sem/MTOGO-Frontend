import { clearAuthSession } from '@/shared/utils/authSession.js'

// Pathing
// _______
// src/api/client.js

// Relative, so the same build works locally (Vite proxy) and on the server (reverse proxy)
const BASE_URL = '/v1'

export async function client(endpoint, options = {}) {
	const { authenticated = true, ...requestOptions } = options
	// ---- SETUP ----------------------------------------------------------------------------------------------------------

	const url = `${BASE_URL}${endpoint}`
	const token = authenticated ? localStorage.getItem('access_token') : null

	// ---- CONFIG --------------------------------------------------------------------------------------------------------

	const config = {
		...requestOptions,
		headers: {
			'Content-Type': 'application/json',
			...(token && {
				Authorization: `Bearer ${token}`,
			}),
			...(requestOptions.headers || {}),
		},
	}

	// ---- REQUEST -------------------------------------------------------------------------------------------------------

	const response = await fetch(url, config)

	const data = await response.json().catch(() => null)

	// ---- ERROR HANDLE --------------------------------------------------------------------------------------------------

	if (!response.ok) {
		if (
			authenticated &&
			response.status === 401 &&
			token &&
			token === localStorage.getItem('access_token')
		) {
			clearAuthSession()
		}

		const error = new Error(
			response.status < 500
				? data?.detail || 'Forespørgslen kunne ikke gennemføres.'
				: 'Der opstod en serverfejl. Prøv igen senere.',
		)

		error.status = response.status
		error.data = data

		throw error
	}

	return data
}
