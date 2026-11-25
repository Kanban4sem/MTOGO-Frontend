import {
	deleteDeliveryAddress,
	getDeliveryAddresses,
	saveDeliveryAddress,
} from '@/api/endpoints/deliveryAddresses.js'

export function listSavedDeliveryAddresses(signal) {
	return getDeliveryAddresses(signal)
}

export function storeDeliveryAddress(address, id, signal) {
	return saveDeliveryAddress(address, id, signal)
}

export async function removeDeliveryAddress(id, signal) {
	try {
		await deleteDeliveryAddress(id, signal)
	} catch (error) {
		if (error.status !== 404) throw error
	}
}
