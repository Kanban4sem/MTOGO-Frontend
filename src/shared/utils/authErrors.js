// Login and register know what these statuses mean for them. The client's message covers the rest, including 403.
const AUTH_MESSAGES = {
	400: 'Kontrollér dine oplysninger, og prøv igen.',
	401: 'Email eller password er forkert. Prøv igen.',
	404: 'Login og registrering er ikke tilgængeligt lige nu.',
	409: 'Der findes allerede en konto med denne email.',
}

export function getAuthErrorMessage(error) {
	return AUTH_MESSAGES[error.status] ?? error.message
}
