import {
	getCurrentUser,
	loginUser,
	logoutUser,
	registerUser,
} from '@/api/endpoints/users.js'
import { clearAuthSession } from '@/shared/utils/authSession.js'

export function registerAccount(registration) {
	return registerUser(registration)
}

export function getSignedInUser() {
	return getCurrentUser()
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
