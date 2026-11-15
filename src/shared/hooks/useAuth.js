import { useContext } from 'react'
import { AuthContext } from '@/shared/context/AuthContext.jsx'

export function useAuth() {
	const auth = useContext(AuthContext)
	if (auth === null) {
		throw new Error('useAuth must be used within AuthProvider')
	}
	return auth
}
