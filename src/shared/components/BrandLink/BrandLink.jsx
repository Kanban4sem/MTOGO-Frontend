import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslations } from '@/shared/i18n/useTranslations.js'
import messages from '@/shared/components/BrandLink/messages.json'
import styles from '@/shared/components/BrandLink/BrandLink.module.css'

export default function BrandLink() {
	const t = useTranslations(messages)
	const icon = useRef(null)
	const animation = useRef(null)
	const isTilting = useRef(false)

	function animateIcon(keyframes, options) {
		const tile = icon.current
		const transform = window.getComputedStyle(tile).transform
		animation.current?.cancel()
		animation.current = tile.animate([{ transform }, ...keyframes], options)
	}

	function tiltIcon() {
		if (isTilting.current) return
		isTilting.current = true
		animateIcon([{ transform: 'rotate(-45deg)' }], {
			duration: 1200,
			easing: 'ease-out',
			fill: 'forwards',
		})
	}

	function returnIcon() {
		if (!isTilting.current) return
		isTilting.current = false
		animateIcon(
			[
				{ transform: 'rotate(10deg)', offset: 0.6 },
				{ transform: 'rotate(-4deg)', offset: 0.79 },
				{ transform: 'rotate(1deg)', offset: 0.92 },
				{ transform: 'rotate(0deg)' },
			],
			{ duration: 500 },
		)
	}

	return (
		<Link
			className={styles.brand}
			to="/"
			aria-label={t('brandHome')}
			onPointerEnter={(event) => {
				if (event.pointerType !== 'touch') tiltIcon()
			}}
			onPointerLeave={returnIcon}
			onFocus={(event) => {
				if (event.currentTarget.matches(':focus-visible')) tiltIcon()
			}}
			onBlur={returnIcon}
			onClick={returnIcon}
		>
			<span ref={icon} className={styles.icon} aria-hidden="true">
				m.
			</span>
			MTOGO<span className={styles.dot}>.</span>
		</Link>
	)
}
