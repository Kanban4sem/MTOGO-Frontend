import { useEffect, useState } from 'react'
import { getRestaurantDirectory } from '@/shared/services/restaurantService.js'

export function useRestaurants() {
	const [state, setState] = useState({
		restaurants: [],
		isLoading: true,
		error: null,
	})

	useEffect(() => {
		const controller = new AbortController()

		getRestaurantDirectory(controller.signal)
			.then((restaurants) => {
				if (!controller.signal.aborted)
					setState({ restaurants, isLoading: false, error: null })
			})
			.catch((error) => {
				if (!controller.signal.aborted)
					setState({ restaurants: [], isLoading: false, error })
			})

		return () => controller.abort()
	}, [])

	return state
}
