import { useEffect, useRef, useState } from 'react'
import {
	getSignedInUser,
	login as startSession,
	logout as endSession,
	updateCustomerProfile,
} from '@/shared/services/userService.js'
import {
	ACCESS_TOKEN_KEY,
	AUTH_SESSION_CLEARED,
} from '@/shared/utils/authSession.js'
import { AuthContext } from '@/shared/context/AuthContext.jsx'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [isSessionExpired, setIsSessionExpired] = useState(false)
	const [isLoading, setIsLoading] = useState(() =>
		Boolean(localStorage.getItem(ACCESS_TOKEN_KEY)),
	)
	const sessionVersion = useRef(0)
	// A 401 only means an expired session when someone was logged in, not for a stale token at startup.
	const userRef = useRef(null)

	useEffect(() => {
		userRef.current = user
	}, [user])

	useEffect(() => {
		let active = true

		function clearUser(event) {
			sessionVersion.current += 1
			setIsSessionExpired(
				event?.detail?.expired === true && userRef.current !== null,
			)
			setUser(null)
			setIsLoading(false)
		}

		async function restoreUser() {
			const version = ++sessionVersion.current
			try {
				const currentUser = await getSignedInUser()
				if (active && version === sessionVersion.current) {
					setUser(currentUser)
				}
			} catch {
				if (active && version === sessionVersion.current) {
					setUser(null)
				}
			} finally {
				if (active && version === sessionVersion.current) {
					setIsLoading(false)
				}
			}
		}

		function syncSession(event) {
			if (event.key !== ACCESS_TOKEN_KEY && event.key !== null) return
			if (localStorage.getItem(ACCESS_TOKEN_KEY)) {
				setIsLoading(true)
				void restoreUser()
			} else {
				clearUser()
			}
		}

		window.addEventListener(AUTH_SESSION_CLEARED, clearUser)
		window.addEventListener('storage', syncSession)
		if (localStorage.getItem(ACCESS_TOKEN_KEY)) void restoreUser()

		return () => {
			active = false
			window.removeEventListener(AUTH_SESSION_CLEARED, clearUser)
			window.removeEventListener('storage', syncSession)
		}
	}, [])

	async function login(credentials) {
		sessionVersion.current += 1
		try {
			const currentUser = await startSession(credentials)
			setIsSessionExpired(false)
			setUser(currentUser)
			return currentUser
		} finally {
			setIsLoading(false)
		}
	}

	async function logout() {
		sessionVersion.current += 1
		try {
			await endSession()
		} finally {
			setIsSessionExpired(false)
			setUser(null)
			setIsLoading(false)
		}
	}

	async function updateProfile(profile, signal) {
		const version = sessionVersion.current
		const updatedUser = await updateCustomerProfile(profile, signal)
		if (version === sessionVersion.current && !signal?.aborted) {
			setUser(updatedUser)
		}
		return updatedUser
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: user !== null,
				isLoading,
				isSessionExpired,
				login,
				logout,
				updateProfile,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
