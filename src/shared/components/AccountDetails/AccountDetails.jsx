import styles from '@/shared/components/AccountDetails/AccountDetails.module.css'

export default function AccountDetails({ user }) {
	const profile = user?.profile
	const name = [profile?.firstName, profile?.lastName]
		.filter(Boolean)
		.join(' ')

	return (
		<dl className={styles.details}>
			{name && (
				<>
					<dt>Navn</dt>
					<dd>{name}</dd>
				</>
			)}
			<dt>E-mail</dt>
			<dd>{user?.email}</dd>
			{profile?.phoneNumber && (
				<>
					<dt>Telefon</dt>
					<dd>{profile.phoneNumber}</dd>
				</>
			)}
		</dl>
	)
}
