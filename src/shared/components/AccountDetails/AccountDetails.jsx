import messages from '@/shared/components/AccountDetails/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import styles from '@/shared/components/AccountDetails/AccountDetails.module.css'

export default function AccountDetails({ user }) {
	const t = useTranslations(messages)
	const profile = user?.profile
	const name = [profile?.firstName, profile?.lastName]
		.filter(Boolean)
		.join(' ')

	return (
		<dl className={styles.details}>
			{name && (
				<>
					<dt>{t('name')}</dt>
					<dd>{name}</dd>
				</>
			)}
			<dt>{t('emailAddress')}</dt>
			<dd>{user?.email}</dd>
			{profile?.phoneNumber && (
				<>
					<dt>{t('phone')}</dt>
					<dd>{profile.phoneNumber}</dd>
				</>
			)}
		</dl>
	)
}
