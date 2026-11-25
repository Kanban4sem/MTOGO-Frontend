import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOrderConfirmationPath } from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { useRequest } from '@/shared/hooks/useRequest.js'
import { listSavedDeliveryAddresses } from '@/shared/services/deliveryAddressService.js'
import { getSignedInUser } from '@/shared/services/userService.js'
import { validateDeliveryAddress } from '@/shared/utils/validateDeliveryAddress.js'
import {
	PAYMENT_TOKENS,
	placeOrderFromBasket,
} from '@/features/checkout-page/services/orderService.js'
import { DELIVERY_ADDRESS_FIELDS } from '@/features/checkout-page/Checkout/checkoutFields.js'

const BASKET_KEPT = 'Din kurv er gemt.'

// Every failure keeps the basket, since it is only emptied after the order is placed.
// The client handles 401: it clears the session, and ProtectedRoute sends the user to login.
// A 403 here can only mean the account is not a customer, so checkout says so instead of the client's general message.
function getCheckoutFailure(error) {
	switch (error.status) {
		case 403:
			return {
				message: `Kun kunder kan bestille, og du er logget ind med en konto, der ikke kan afgive ordrer. ${BASKET_KEPT}`,
			}
		case 402:
			return {
				message: `Betalingen blev afvist, så der er ikke afgivet nogen ordre. ${BASKET_KEPT} Du kan prøve igen.`,
			}
		case 404:
			return {
				message: `Bestilling er ikke tilgængelig lige nu. ${BASKET_KEPT} Prøv igen senere.`,
			}
		case 409:
			return {
				message: `En eller flere retter i kurven kan ikke bestilles lige nu, eller restauranten tager ikke imod bestillinger. ${BASKET_KEPT}`,
				showMenuLink: true,
			}
		default: {
			if (error.status === undefined || error.status < 500) {
				return { message: `${error.message} ${BASKET_KEPT}` }
			}
			const reference = error.data?.errorId
			return {
				message: `Der opstod en fejl hos os. ${BASKET_KEPT} Prøv igen om lidt.${reference ? ` Fejlreference: ${reference}` : ''}`,
			}
		}
	}
}

function withFieldState(fields, fieldErrors, addressDefaults) {
	return fields.map((field) =>
		field.fields
			? {
					...field,
					fields: withFieldState(
						field.fields,
						fieldErrors,
						addressDefaults,
					),
				}
			: {
					...field,
					error: fieldErrors[field.name],
					defaultValue:
						field.defaultValue ?? addressDefaults?.[field.name],
				},
	)
}

async function loadAddresses(signal) {
	const [user, addresses] = await Promise.allSettled([
		getSignedInUser(signal),
		listSavedDeliveryAddresses(signal),
	])
	return {
		profile: user.value?.profile,
		savedAddresses: addresses.value ?? [],
		failed: addresses.status === 'rejected',
	}
}

export function useCheckout() {
	const navigate = useNavigate()
	const { basket, emptyBasket } = useBasket()
	const [fieldErrors, setFieldErrors] = useState({})
	const {
		data: addressRequest,
		isLoading: isAddressLoading,
		updateData: updateAddresses,
	} = useRequest(loadAddresses)
	const [addressChoice, setAddressChoice] = useState(null)
	const [paymentToken, setPaymentToken] = useState(PAYMENT_TOKENS.CARD)
	const [failure, setFailure] = useState(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	// State only updates on the next render, so a second submit in the same tick needs the ref to be stopped.
	const isSubmittingRef = useRef(false)
	const savedAddresses = addressRequest?.savedAddresses ?? []
	const defaultAddress = savedAddresses.find((address) => address.isDefault)
	const selectedAddress =
		addressChoice === null
			? defaultAddress
			: savedAddresses.find(
					(address) => String(address.id) === addressChoice,
				)
	const profileAddress = addressRequest?.profile?.address
	const addressDefaults =
		addressRequest?.failed || !profileAddress?.street
			? profileAddress
			: null

	async function submitOrder(event) {
		event.preventDefault()
		if (isSubmittingRef.current || isAddressLoading) return
		setFailure(null)
		let addressSelection = { deliveryAddressId: selectedAddress?.id }
		if (!selectedAddress) {
			const form = event.currentTarget
			const formData = new FormData(form)
			const deliveryAddress = {
				street: formData.get('street').trim(),
				postalCode: formData.get('postalCode').trim(),
				city: formData.get('city').trim(),
			}
			const errors = validateDeliveryAddress(deliveryAddress)
			setFieldErrors(errors)
			const firstInvalidField = Object.keys(errors)[0]
			if (firstInvalidField) {
				form.elements.namedItem(firstInvalidField)?.focus()
				return
			}
			addressSelection = {
				deliveryAddress,
				useDefaultAddress: false,
				saveAsDefault: formData.has('saveAsDefault'),
			}
		}

		isSubmittingRef.current = true
		setIsSubmitting(true)
		try {
			const order = await placeOrderFromBasket(
				basket,
				addressSelection,
				paymentToken,
			)
			navigate(getOrderConfirmationPath(order.id), {
				state: { order },
			})
			emptyBasket()
		} catch (error) {
			isSubmittingRef.current = false
			setIsSubmitting(false)
			if (error.status === 404 && selectedAddress) {
				updateAddresses((previous) => ({
					...previous,
					savedAddresses: previous.savedAddresses.filter(
						(address) => address.id !== selectedAddress.id,
					),
				}))
				setAddressChoice('')
				setFailure({
					message: `${error.message} ${BASKET_KEPT} Vælg en anden adresse, eller indtast den manuelt.`,
				})
			} else {
				setFailure(getCheckoutFailure(error))
			}
		}
	}

	return {
		savedAddresses,
		selectedAddress,
		setAddressChoice,
		profile: addressRequest?.profile,
		isAddressLoading,
		addressLoadFailed: addressRequest?.failed,
		deliveryAddressFields: withFieldState(
			DELIVERY_ADDRESS_FIELDS,
			fieldErrors,
			addressDefaults,
		),
		paymentToken,
		setPaymentToken,
		failure,
		isSubmitting,
		submitOrder,
	}
}
