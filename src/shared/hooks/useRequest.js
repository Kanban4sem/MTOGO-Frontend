import { useEffect, useState } from 'react'

export function useRequest(load) {
	const [attempt, setAttempt] = useState(0)
	const [result, setResult] = useState(null)
	const current =
		result?.load === load && result.attempt === attempt ? result : null

	useEffect(() => {
		const controller = new AbortController()
		const { signal } = controller

		async function run() {
			try {
				const data = await load(signal)
				if (!signal.aborted) setResult({ load, attempt, data })
			} catch (error) {
				if (!signal.aborted) setResult({ load, attempt, error })
			}
		}

		void run()
		return () => controller.abort()
	}, [load, attempt])

	function reload() {
		setAttempt((previous) => previous + 1)
	}

	function updateData(update) {
		setResult((previous) => {
			if (
				previous?.load !== load ||
				previous.attempt !== attempt ||
				previous.error
			)
				return previous
			return { ...previous, data: update(previous.data) }
		})
	}

	return {
		data: current?.data,
		error: current?.error,
		isLoading: current === null,
		reload,
		updateData,
	}
}
