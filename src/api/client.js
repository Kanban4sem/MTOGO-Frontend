import {
	ACCESS_TOKEN_KEY,
	clearAuthSession,
} from '@/shared/utils/authSession.js'
import { getRequestErrorMessage } from '@/shared/utils/requestErrors.js'

// Relative, so the same build works locally (Vite proxy) and on the server (reverse proxy)
const BASE_URL = '/v1'

export async function client(endpoint, options = {}) {
	const {
		authenticated = true,
		maintenanceFeature,
		...requestOptions
	} = options

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
		const networkError = new Error(
			getRequestErrorMessage({ isNetworkError: true }),
			{ cause: error },
		)
		networkError.isNetworkError = true
		throw networkError
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

		const error = new Error(
			getRequestErrorMessage({ status: response.status, data }),
		)

		error.status = response.status
		error.data = data
		if (
			maintenanceFeature &&
			response.status === 503 &&
			response.headers.get('content-type')?.split(';')[0] ===
				'application/problem+json' &&
			data?.status === 503 &&
			data.instance === url &&
			data.errorId == null &&
			typeof data.detail === 'string' &&
			data.detail.trim()
		) {
			error.maintenanceFeature = maintenanceFeature
		}

		throw error
	}

	return data
}
