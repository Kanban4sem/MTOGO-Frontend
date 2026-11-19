export const AUTH_SESSION_CLEARED = 'mtogo:auth-session-cleared'

// `expired` tells login why the user was logged out, so a 401 isn't mistaken for logging out.
export function clearAuthSession({ expired = false } = {}) {
	localStorage.removeItem('access_token')
	window.dispatchEvent(
		new CustomEvent(AUTH_SESSION_CLEARED, { detail: { expired } }),
	)
}
