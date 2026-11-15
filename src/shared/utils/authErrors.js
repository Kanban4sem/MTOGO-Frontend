export function getAuthErrorMessage(error) {
	const messages = {
		400: 'Kontrollér dine oplysninger, og prøv igen.',
		401: 'Email eller password er forkert. Prøv igen.',
		403: 'Du har ikke adgang til denne handling.',
		404: 'Login og registrering er ikke tilgængeligt lige nu.',
		409: 'Der findes allerede en konto med denne email.',
	}

	if (messages[error.status]) return messages[error.status]

	if (!error.status) {
		return 'Kunne ikke oprette forbindelse. Prøv igen om lidt.'
	}

	const reference = error.data?.errorId
	return `Der opstod en fejl. Prøv igen senere.${reference ? ` Fejlreference: ${reference}` : ''}`
}
