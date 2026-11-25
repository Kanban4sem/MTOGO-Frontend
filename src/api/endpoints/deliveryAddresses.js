import { client } from '@/api/client.js'

const COLLECTION = '/users/me/delivery-addresses'

export function getDeliveryAddresses(signal) {
	return client(COLLECTION, { signal })
}

export function saveDeliveryAddress(address, id, signal) {
	return client(id == null ? COLLECTION : `${COLLECTION}/${id}`, {
		method: id == null ? 'POST' : 'PUT',
		body: JSON.stringify(address),
		signal,
	})
}

export function deleteDeliveryAddress(id, signal) {
	return client(`${COLLECTION}/${id}`, { method: 'DELETE', signal })
}
