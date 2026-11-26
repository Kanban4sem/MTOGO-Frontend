import {
	ACCESS_TOKEN_KEY,
	clearAuthSession,
} from '@/shared/utils/authSession.js'
import { withErrorReference } from '@/shared/utils/errorReference.js'

// Relative, so the same build works locally (Vite proxy) and on the server (reverse proxy)
const BASE_URL = '/v1'

const REJECTED_INPUT =
	'Oplysningerne blev afvist. Kontrollér dem, og prøv igen.'

const STATUS_MESSAGES = {
	400: REJECTED_INPUT,
	403: 'Du har ikke adgang til denne handling.',
	404: 'Det, du leder efter, findes ikke længere.',
	409: 'Det er ændret i mellemtiden. Opdatér siden, og prøv igen.',
	422: REJECTED_INPUT,
}

// The one place that turns a status into the user's message, so every view says the same thing.
// The backend's detail is English and stays in error.data for debugging, never in the message.
// A view that adds its own text to the general message uses this and adds the reference itself.
export function getStatusMessage(status) {
	if (status >= 500) return 'Der opstod en serverfejl. Prøv igen senere.'
	return STATUS_MESSAGES[status] ?? 'Forespørgslen kunne ikke gennemføres.'
}

function getErrorMessage(status, data) {
	return withErrorReference(getStatusMessage(status), { status, data })
}

export async function client(endpoint, options = {}) {
	const { authenticated = true, ...requestOptions } = options

	const url = `${BASE_URL}${endpoint}`
	const token = authenticated ? localStorage.getItem(ACCESS_TOKEN_KEY) : null

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
		// The one place that detects a 401: the session has expired, and ProtectedRoute sends the user to login.
		// A missing token also counts, as when it was removed by hand, but not one replaced since the request.
		if (
			authenticated &&
			response.status === 401 &&
			token === localStorage.getItem(ACCESS_TOKEN_KEY)
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
