import { useSyncExternalStore } from 'react'
import Button from '@/shared/components/Button/Button.jsx'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import messages from '@/shared/components/ToTop/messages.json'
import styles from '@/shared/components/ToTop/ToTop.module.css'

const SCROLL_THRESHOLD_PX = 400

function subscribeToScroll(onScroll) {
	window.addEventListener('scroll', onScroll, { passive: true })
	return () => window.removeEventListener('scroll', onScroll)
}

function isPastThreshold() {
	return window.scrollY > SCROLL_THRESHOLD_PX
}

export default function ToTop() {
	const t = useTranslations(messages)
	const isVisible = useSyncExternalStore(subscribeToScroll, isPastThreshold)

	if (!isVisible) return null

	const label = t('toTop')
	return (
		<Button
			className={styles.button}
			label={<span className={styles.chevron} aria-hidden="true" />}
			aria-label={label}
			title={label}
			onClick={() => window.scrollTo({ top: 0 })}
		/>
	)
}
