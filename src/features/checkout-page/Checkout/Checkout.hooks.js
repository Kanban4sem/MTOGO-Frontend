import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getStatusMessage } from '@/api/client.js'
import { getOrderConfirmationPath } from '@/shared/data/paths.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import {
	useNotification,
	useRequestErrorNotification,
} from '@/shared/hooks/useNotification.js'
import { useRequest } from '@/shared/hooks/useRequest.js'
import { listSavedDeliveryAddresses } from '@/shared/services/deliveryAddressService.js'
import { getSignedInUser } from '@/shared/services/userService.js'
import { withErrorReference } from '@/shared/utils/errorReference.js'
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
				message: `Kun kunder kan bestille. ${BASKET_KEPT}`,
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
		default:
			// The reference goes last, so it doesn't split the general message from the basket notice.
			// A network failure has no status and keeps the client's connection message.
			return {
				message: error.status
					? withErrorReference(
							`${getStatusMessage(error.status)} ${BASKET_KEPT}`,
							error,
						)
					: `${error.message} ${BASKET_KEPT}`,
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
		addressError: addresses.reason,
	}
}

export function useCheckout() {
	const navigate = useNavigate()
	const notify = useNotification()
	const { basket, emptyBasket } = useBasket()
	const [fieldErrors, setFieldErrors] = useState({})
	const {
		data: addressRequest,
		isLoading: isAddressLoading,
		updateData: updateAddresses,
	} = useRequest(loadAddresses)
	const [addressChoice, setAddressChoice] = useState(null)
	const [paymentToken, setPaymentToken] = useState(PAYMENT_TOKENS.CARD)
	const [showMenuLink, setShowMenuLink] = useState(false)
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
	const addressError = addressRequest?.addressError
	useRequestErrorNotification(
		addressError,
		addressError &&
			withErrorReference(
				'Vi kunne ikke hente dine gemte adresser. Du kan indtaste leveringsadressen manuelt.',
				addressError,
			),
	)
	const profileAddress = addressRequest?.profile?.address
	const addressDefaults =
		addressError || !profileAddress?.street ? profileAddress : null

	async function submitOrder(event) {
		event.preventDefault()
		if (isSubmittingRef.current || isAddressLoading) return
		setShowMenuLink(false)
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
				notify(Object.values(errors).join(' '), 'warning')
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
			notify('Din ordre er sendt!', 'success')
			navigate(getOrderConfirmationPath(order.id))
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
				notify(
					`Den valgte adresse findes ikke længere. ${BASKET_KEPT} Vælg en anden adresse, eller indtast den manuelt.`,
					'warning',
				)
			} else if (error.status !== 401) {
				const failure = getCheckoutFailure(error)
				setShowMenuLink(failure.showMenuLink === true)
				notify(failure.message, 'error')
			}
		}
	}

	return {
		savedAddresses,
		selectedAddress,
		setAddressChoice,
		profile: addressRequest?.profile,
		isAddressLoading,
		deliveryAddressFields: withFieldState(
			DELIVERY_ADDRESS_FIELDS,
			fieldErrors,
			addressDefaults,
		),
		paymentToken,
		setPaymentToken,
		showMenuLink,
		isSubmitting,
		submitOrder,
	}
}
