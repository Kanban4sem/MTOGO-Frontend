import { useLanguage } from '@/shared/i18n/useLanguage.js'
import messages from '@/features/checkout-page/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { Link } from 'react-router-dom'
import BasketSummary from '@/shared/components/BasketSummary/BasketSummary.jsx'
import Button from '@/shared/components/Button/Button.jsx'
import FeatureUnavailable from '@/shared/components/FeatureUnavailable/FeatureUnavailable.jsx'
import FormFields from '@/shared/components/FormFields/FormFields.jsx'
import RequestState from '@/shared/components/RequestState/RequestState.jsx'
import Select from '@/shared/components/Select/Select.jsx'
import { MAINTENANCE_FEATURES } from '@/shared/data/maintenanceFeatures.js'
import { getRestaurantMenuPath, RESTAURANTS_PATH } from '@/shared/data/paths.js'
import { USER_ROLES } from '@/shared/data/userRoles.js'
import { useAuth } from '@/shared/hooks/useAuth.js'
import { useBasket } from '@/shared/hooks/useBasket.js'
import { formatDeliveryAddress } from '@/shared/utils/formatDeliveryAddress.js'
import { formatPrice } from '@/shared/utils/formatPrice.js'
import { PAYMENT_TOKENS } from '@/features/checkout-page/services/orderService.js'
import { useCheckout } from '@/features/checkout-page/Checkout/Checkout.hooks.js'
import {
	getCardFields,
	getPaymentOptions,
} from '@/features/checkout-page/Checkout/checkoutFields.js'
import styles from '@/features/checkout-page/Checkout/Checkout.module.css'

export default function Checkout() {
	const t = useTranslations(messages)
	const { user } = useAuth()
	const { isEmpty } = useBasket()

	// CheckoutPage only renders this for a logged-in user.
	if (user.role !== USER_ROLES.CUSTOMER) {
		return (
			<RequestState title={t('customersOnly')}>
				{t('customerAccountRequired')}
			</RequestState>
		)
	}
	if (isEmpty) {
		return (
			<RequestState title={t('emptyBasket')}>
				{t('addBeforeOrdering')}{' '}
				<Link to={RESTAURANTS_PATH}>{t('findRestaurant')}</Link>
			</RequestState>
		)
	}
	return <CheckoutForm accountProfile={user.profile} />
}

function CheckoutForm({ accountProfile }) {
	const { language } = useLanguage()
	const t = useTranslations(messages)
	const { basket, total } = useBasket()
	const {
		savedAddresses,
		selectedAddress,
		setAddressChoice,
		profile,
		isAddressLoading,
		deliveryAddressFields,
		paymentToken,
		setPaymentToken,
		isOrderingPaused,
		showMenuLink,
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
			<h1 className={styles.title}>{t('checkout')}</h1>
			<section
				className={styles.basket}
				aria-labelledby="checkout-basket"
			>
				<h2 id="checkout-basket">{t('yourBasket')}</h2>
				<BasketSummary
					totalLabel={t('basketTotalPreview')}
					totalNote={t('finalTotalOnOrder')}
					disabled={isSubmitting}
				/>
				<Link className={styles.back} to={menuPath}>
					{t('addMoreDishes')}
				</Link>
			</section>
			<form
				className={styles.form}
				onSubmit={submitOrder}
				noValidate
				aria-busy={isSubmitting}
			>
				<fieldset className={styles.group} disabled={isSubmitting}>
					<legend>{t('deliveryAddress')}</legend>
					{recipient && (
						<p className={styles.note}>
							{t('deliverTo')} {recipient}
						</p>
					)}
					{isAddressLoading && (
						<p role="status" className={styles.note}>
							{t('loadingSavedAddresses')}
						</p>
					)}
					{savedAddresses.length > 0 && (
						<Select
							label={t('selectDeliveryAddress')}
							value={
								selectedAddress
									? String(selectedAddress.id)
									: ''
							}
							onChange={(event) =>
								setAddressChoice(event.target.value)
							}
							options={[
								...savedAddresses.map((address) => {
									const label = formatDeliveryAddress(address)
									return {
										value: String(address.id),
										label: address.isDefault
											? t('defaultAddressOption', {
													address: label,
												})
											: label,
									}
								}),
								{
									value: '',
									label: t('differentAddress'),
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
								{t('saveDefaultAddress')}
							</label>
						</fieldset>
					)}
					<p className={styles.note}>{t('denmarkOnly')}</p>
				</fieldset>
				<fieldset className={styles.group} disabled={isSubmitting}>
					<legend>{t('payment')}</legend>
					{isOrderingPaused ? (
						<FeatureUnavailable
							feature={MAINTENANCE_FEATURES.ORDERING}
						/>
					) : (
						<>
							{getPaymentOptions(t).map(({ token, label }) => (
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
										{t('simulatedPayment')}
									</p>
									<FormFields fields={getCardFields(t)} />
								</div>
							)}
						</>
					)}
				</fieldset>
				{showMenuLink && (
					<Link to={menuPath}>
						{t('restaurantMenuLink')} {basket.restaurant.name}
					</Link>
				)}
				{!isOrderingPaused && (
					<Button
						type="submit"
						size="l"
						label={
							isSubmitting
								? t('placingOrder')
								: t('payAndOrder', {
										price: formatPrice(total, language),
									})
						}
						disabled={isSubmitting || isAddressLoading}
					/>
				)}
			</form>
		</div>
	)
}
