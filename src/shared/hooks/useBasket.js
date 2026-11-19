import { useContext } from 'react'
import { BasketContext } from '@/shared/context/BasketContext.jsx'

export function useBasket() {
	const basket = useContext(BasketContext)
	if (basket === null) {
		throw new Error('useBasket must be used within BasketProvider')
	}
	return basket
}
