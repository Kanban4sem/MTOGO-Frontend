// Only a 5xx carries an errorId, which finds the entry in the backend's log.
export function errorReference(error) {
	const errorId = error?.status >= 500 ? error.data?.errorId : undefined
	return errorId ? `Fejlreference: ${errorId}` : ''
}

export function withErrorReference(text, error) {
	return [text, errorReference(error)].filter(Boolean).join(' ')
}
