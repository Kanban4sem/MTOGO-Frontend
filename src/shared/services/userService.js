import {
	getCurrentUser,
	loginUser,
	logoutUser,
	registerUser,
	updateCurrentUser,
} from '@/api/endpoints/users.js'
import { clearAuthSession } from '@/shared/utils/authSession.js'

export function registerAccount(registration) {
	return registerUser(registration)
}

export function getSignedInUser(signal) {
	return getCurrentUser(signal)
}

export function updateCustomerProfile(profile, signal) {
	return updateCurrentUser(profile, signal)
}

export async function signIn(credentials) {
	const session = await loginUser(credentials)
	localStorage.setItem('access_token', session.accessToken)
	return session.user
}

export async function signOut() {
	try {
		await logoutUser()
	} catch (error) {
		if (error.status !== 401) throw error
	} finally {
		clearAuthSession()
	}
}
