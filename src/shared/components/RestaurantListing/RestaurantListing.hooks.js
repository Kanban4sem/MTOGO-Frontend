import { useCallback } from 'react'
import { useRequest } from '@/shared/hooks/useRequest.js'
import { getRestaurantDirectory } from '@/shared/services/restaurantService.js'

export function useRestaurants(limit) {
	const loadRestaurants = useCallback(
		(signal) => getRestaurantDirectory(signal, limit),
		[limit],
	)
	const {
		data: restaurants = [],
		isLoading,
		error,
		reload: retry,
	} = useRequest(loadRestaurants)
	return { restaurants, isLoading, error, retry }
}
