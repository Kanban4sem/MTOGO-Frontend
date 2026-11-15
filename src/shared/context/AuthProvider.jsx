import { useEffect, useRef, useState } from 'react'
import {
	getSignedInUser,
	signIn,
	signOut,
} from '@/shared/services/userService.js'
import { AUTH_SESSION_CLEARED } from '@/shared/utils/authSession.js'
import { AuthContext } from '@/shared/context/AuthContext.jsx'

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(() =>
		Boolean(localStorage.getItem('access_token')),
	)
	const sessionVersion = useRef(0)

	useEffect(() => {
		let active = true

		function clearUser() {
			sessionVersion.current += 1
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
			if (event.key !== 'access_token' && event.key !== null) return
			if (localStorage.getItem('access_token')) {
				setIsLoading(true)
				void restoreUser()
			} else {
				clearUser()
			}
		}

		window.addEventListener(AUTH_SESSION_CLEARED, clearUser)
		window.addEventListener('storage', syncSession)
		if (localStorage.getItem('access_token')) void restoreUser()

		return () => {
			active = false
			window.removeEventListener(AUTH_SESSION_CLEARED, clearUser)
			window.removeEventListener('storage', syncSession)
		}
	}, [])

	async function login(credentials) {
		sessionVersion.current += 1
		try {
			const currentUser = await signIn(credentials)
			setUser(currentUser)
			return currentUser
		} finally {
			setIsLoading(false)
		}
	}

	async function logout() {
		sessionVersion.current += 1
		try {
			await signOut()
		} finally {
			setUser(null)
			setIsLoading(false)
		}
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isAuthenticated: user !== null,
				isLoading,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
