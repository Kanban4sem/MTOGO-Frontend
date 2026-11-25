import { Link } from 'react-router-dom'
import BasketSummary from '@/shared/components/BasketSummary/BasketSummary.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import Select from '@/shared/components/Select/Select.jsx'
import { getRestaurantMenuPath, RESTAURANTS_PATH } from '@/shared/data/paths.js'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { formatDeliveryAddress } from '@/shared/utils/formatDeliveryAddress.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { PAYMENT_TOKENS } from '@/features/checkout-page/services/orderService.js'
import { useCheckout } from '@/features/checkout-page/Checkout/Checkout.hooks.js'
import {
	CARD_FIELDS,
	PAYMENT_OPTIONS,
} from '@/features/checkout-page/Checkout/checkoutFields.js'
import styles from '@/features/checkout-page/Checkout/Checkout.module.css'

export default function Checkout() {
	const { user } = useAuth()
	const { isEmpty } = useBasket()

	// CheckoutPage only renders this for a logged-in user.
	if (user.role !== USER_ROLES.CUSTOMER) {
		return (
			<RequestState title="Kun kunder kan bestille">
				Du er logget ind med en konto, der ikke kan afgive ordrer.
			</RequestState>
		)
	}
	if (isEmpty) {
		return (
			<RequestState title="Din kurv er tom">
				Læg nogle retter i kurven, før du bestiller.{' '}
				<Link to={RESTAURANTS_PATH}>Find en restaurant</Link>
			</RequestState>
		)
	}
	return <CheckoutForm accountProfile={user.profile} />
}

function CheckoutForm({ accountProfile }) {
	const { basket, total } = useBasket()
	const {
		savedAddresses,
		selectedAddress,
		setAddressChoice,
		profile,
		isAddressLoading,
		addressLoadFailed,
		deliveryAddressFields,
		paymentToken,
		setPaymentToken,
		failure,
		isSubmitting,
		submitOrder,
	} = useCheckout()
	const menuPath = getRestaurantMenuPath(basket.restaurant.id)
	const recipientProfile = profile ?? accountProfile
	const recipient = [recipientProfile?.firstName, recipientProfile?.lastName]
		.filter(Boolean)
		.join(' ')

	return (
		<div className={styles.checkout}>
			<h1 className={styles.title}>Kassen</h1>
			<section
				className={styles.basket}
				aria-labelledby="checkout-basket"
			>
				<h2 id="checkout-basket">Din kurv</h2>
				<BasketSummary
					totalLabel="Kurvens total (forhåndsvisning)"
					totalNote="Den endelige ordretotal beregnes, når ordren afgives."
					disabled={isSubmitting}
				/>
				<Link className={styles.back} to={menuPath}>
					Tilføj flere retter
				</Link>
			</section>
			<form
				className={styles.form}
				onSubmit={submitOrder}
				noValidate
				aria-busy={isSubmitting}
			>
				<fieldset className={styles.group} disabled={isSubmitting}>
					<legend>Leveringsadresse</legend>
					{recipient && (
						<p className={styles.note}>Leveres til {recipient}</p>
					)}
					{isAddressLoading && (
						<p role="status" className={styles.note}>
							Henter dine gemte adresser…
						</p>
					)}
					{addressLoadFailed && (
						<p role="status" className={styles.note}>
							Vi kunne ikke hente dine gemte adresser. Du kan
							indtaste leveringsadressen her.
						</p>
					)}
					{savedAddresses.length > 0 && (
						<Select
							label="Vælg leveringsadresse"
							value={
								selectedAddress
									? String(selectedAddress.id)
									: ''
							}
							onChange={(event) =>
								setAddressChoice(event.target.value)
							}
							options={[
								...savedAddresses.map((address) => ({
									value: String(address.id),
									label: `${formatDeliveryAddress(address)}${address.isDefault ? ' (standard)' : ''}`,
								})),
								{
									value: '',
									label: 'Indtast en anden adresse',
								},
							]}
						/>
					)}
					{!isAddressLoading && (
						<fieldset
							className={styles.addressFields}
							hidden={Boolean(selectedAddress)}
							disabled={Boolean(selectedAddress)}
						>
							<FormFields fields={deliveryAddressFields} />
							<label className={styles.option}>
								<input type="checkbox" name="saveAsDefault" />
								Gem som standardadresse efter godkendt betaling
							</label>
						</fieldset>
					)}
					<p className={styles.note}>Vi leverer kun i Danmark.</p>
				</fieldset>
				<fieldset className={styles.group} disabled={isSubmitting}>
					<legend>Betaling</legend>
					{PAYMENT_OPTIONS.map(({ token, label }) => (
						<label key={token} className={styles.option}>
							<input
								type="radio"
								name="paymentToken"
								value={token}
								checked={paymentToken === token}
								onChange={() => setPaymentToken(token)}
							/>
							{label}
						</label>
					))}
					{paymentToken === PAYMENT_TOKENS.CARD && (
						<div className={styles.card}>
							<p className={styles.note}>
								Betalingen er simuleret, og der trækkes ingen
								penge. Du skal ikke indtaste kortoplysninger.
							</p>
							<FormFields fields={CARD_FIELDS} />
						</div>
					)}
				</fieldset>
				{failure && (
					<div className={styles.failure} role="alert">
						<p>{failure.message}</p>
						{failure.showMenuLink && (
							<Link to={menuPath}>
								Gå til menuen hos {basket.restaurant.name}
							</Link>
						)}
					</div>
				)}
				<Button
					type="submit"
					size="l"
					label={
						isSubmitting
							? 'Afgiver ordren…'
							: `Betal og bestil · ${formatPrice(total)}`
					}
					disabled={isSubmitting || isAddressLoading}
				/>
			</form>
		</div>
	)
}
