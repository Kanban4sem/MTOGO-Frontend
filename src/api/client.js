import { clearAuthSession } from '@/shared/utils/authSession.js'

// Relative, so the same build works locally (Vite proxy) and on the server (reverse proxy)
const BASE_URL = '/v1'

// The one place for 403, so every view tells the user the same thing.
function getErrorMessage(status, data) {
	if (status === 403) return 'Du har ikke adgang til denne handling.'
	if (status >= 500) return 'Der opstod en serverfejl. Prøv igen senere.'
	return data?.detail || 'Forespørgslen kunne ikke gennemføres.'
}

export async function client(endpoint, options = {}) {
	const { authenticated = true, ...requestOptions } = options

	const url = `${BASE_URL}${endpoint}`
	const token = authenticated ? localStorage.getItem('access_token') : null

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

	let response
	try {
		response = await fetch(url, config)
	} catch (error) {
		if (error.name === 'AbortError') throw error
		throw new Error(
			'Vi kunne ikke få forbindelse til MTOGO. Tjek din internetforbindelse, og prøv igen.',
			{ cause: error },
		)
	}

	const data = await response.json().catch(() => null)

	if (!response.ok) {
		// The one place that detects a 401: the session has expired, and ProtectedRoutes sends the user to login.
		// A missing token also counts, as when it was removed by hand, but not one replaced since the request.
		if (
			authenticated &&
			response.status === 401 &&
			token === localStorage.getItem('access_token')
		) {
			clearAuthSession({ expired: true })
		}

		const error = new Error(getErrorMessage(response.status, data))

		error.status = response.status
		error.data = data

		throw error
	}

	return data
}
