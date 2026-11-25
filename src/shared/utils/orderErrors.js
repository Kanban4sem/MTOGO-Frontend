// The backend answers 404 for an unknown order and for another customer's, so neither reveals that the order exists.
// An id that isn't a number gets 400, which to the customer is the same: there is no such order.
export function isOrderNotFound(error) {
	return error.status === 400 || error.status === 404
}
