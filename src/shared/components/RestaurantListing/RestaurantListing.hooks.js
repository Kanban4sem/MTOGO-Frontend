import { useEffect, useState } from 'react'
import { getRestaurantDirectory } from '@/shared/services/restaurantService.js'

const LOADING = { restaurants: [], isLoading: true, error: null }

export function useRestaurants(limit) {
	const [state, setState] = useState(LOADING)
	const [attempt, setAttempt] = useState(0)

	useEffect(() => {
		const controller = new AbortController()

		getRestaurantDirectory(controller.signal, limit)
			.then((restaurants) => {
				if (!controller.signal.aborted)
					setState({ restaurants, isLoading: false, error: null })
			})
			.catch((error) => {
				if (!controller.signal.aborted)
					setState({ restaurants: [], isLoading: false, error })
			})

		return () => controller.abort()
	}, [attempt, limit])

	function retry() {
		setState(LOADING)
		setAttempt((previous) => previous + 1)
	}

	return { ...state, retry }
}
