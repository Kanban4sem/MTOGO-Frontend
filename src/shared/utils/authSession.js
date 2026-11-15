export const AUTH_SESSION_CLEARED = 'mtogo:auth-session-cleared'

export function clearAuthSession() {
	localStorage.removeItem('access_token')
	window.dispatchEvent(new Event(AUTH_SESSION_CLEARED))
}
