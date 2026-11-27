import messages from '@/shared/components/ProfileOverview/messages.json'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import { useId } from 'react'
import AccountDetails from '@/shared/components/AccountDetails/AccountDetails.jsx'
import styles from '@/shared/components/ProfileOverview/ProfileOverview.module.css'

export default function ProfileOverview({ title, user, actions }) {
	const t = useTranslations(messages)
	const titleId = useId()
	const names = [user?.profile?.firstName, user?.profile?.lastName]
	const initials = names
		.map((name) => Array.from(name?.trim() ?? '')[0])
		.join('')
	const avatar = (
		initials ||
		Array.from(user?.email ?? '')[0] ||
		'?'
	).toLocaleUpperCase('da')

	return (
		<section className="profilePage" aria-labelledby={titleId}>
			<header className={styles.banner}>
				<div className={styles.identity}>
					<span className={styles.avatar} aria-hidden="true">
						{avatar}
					</span>
					<h1 id={titleId}>{title}</h1>
				</div>
				{actions && <div className={styles.actions}>{actions}</div>}
			</header>
			<div className={styles.details}>
				<h2>{t('accountDetails')}</h2>
				<AccountDetails user={user} />
			</div>
		</section>
	)
}
