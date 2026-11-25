import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '@/shared/components/Dropdown/Dropdown.module.css'

export default function Dropdown({
	label,
	ariaLabel,
	links,
	children,
	className,
	buttonClassName,
	listClassName,
	openOnHover = true,
	onOpenChange,
}) {
	const listId = useId()
	const dropdown = useRef(null)
	const button = useRef(null)
	const list = useRef(null)
	const [openedBy, setOpenedBy] = useState(null)
	const isOpen = openedBy !== null

	const closeDropdown = useCallback(() => {
		setOpenedBy(null)
		onOpenChange?.(false)
	}, [onOpenChange])

	useEffect(() => {
		if (!isOpen) return

		function closeOnOutsidePress(event) {
			if (!dropdown.current.contains(event.target)) closeDropdown()
		}

		function closeOnEscape(event) {
			if (event.key !== 'Escape' || event.defaultPrevented) return
			if (list.current.contains(document.activeElement))
				button.current.focus()
			closeDropdown()
		}

		document.addEventListener('pointerdown', closeOnOutsidePress)
		document.addEventListener('keydown', closeOnEscape)
		return () => {
			document.removeEventListener('pointerdown', closeOnOutsidePress)
			document.removeEventListener('keydown', closeOnEscape)
		}
	}, [isOpen, closeDropdown])

	function openFromHover(event) {
		if (event.pointerType === 'mouse' && !isOpen) {
			setOpenedBy('hover')
			onOpenChange?.(true)
		}
	}

	function closeAfterHover(event) {
		if (
			event.pointerType !== 'mouse' ||
			openedBy !== 'hover' ||
			list.current.contains(document.activeElement)
		)
			return
		closeDropdown()
	}

	function closeOnFocusOut(event) {
		if (isOpen && !event.currentTarget.contains(event.relatedTarget))
			closeDropdown()
	}

	function toggleFromPress() {
		const isOpening = openedBy !== 'press'
		setOpenedBy(isOpening ? 'press' : null)
		onOpenChange?.(isOpening)
	}

	return (
		<div
			ref={dropdown}
			className={
				className ? `${styles.dropdown} ${className}` : styles.dropdown
			}
			onPointerEnter={openOnHover ? openFromHover : undefined}
			onPointerLeave={openOnHover ? closeAfterHover : undefined}
			onBlur={closeOnFocusOut}
		>
			<button
				ref={button}
				className={buttonClassName}
				type="button"
				aria-label={ariaLabel}
				aria-expanded={isOpen}
				aria-controls={listId}
				onClick={toggleFromPress}
			>
				{label}
				{links && (
					<span className={styles.chevron} aria-hidden="true" />
				)}
			</button>
			<ul
				ref={list}
				id={listId}
				className={
					listClassName
						? `${styles.links} ${listClassName}`
						: styles.links
				}
				hidden={!isOpen}
				tabIndex={links ? undefined : 0}
			>
				{links?.map(({ label, to }) => (
					<li key={to}>
						<Link to={to} onClick={closeDropdown}>
							{label}
						</Link>
					</li>
				))}
				{children}
			</ul>
		</div>
	)
}
