import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from '@/shared/components/Dropdown/Dropdown.module.css'

export default function Dropdown({ label, links, buttonClassName }) {
	const listId = useId()
	const dropdown = useRef(null)
	const button = useRef(null)
	const list = useRef(null)
	const [openedBy, setOpenedBy] = useState(null)
	const isOpen = openedBy !== null

	useEffect(() => {
		if (!isOpen) return

		function closeOnOutsidePress(event) {
			if (!dropdown.current.contains(event.target)) setOpenedBy(null)
		}

		function closeOnEscape(event) {
			if (event.key !== 'Escape' || event.defaultPrevented) return
			if (list.current.contains(document.activeElement))
				button.current.focus()
			setOpenedBy(null)
		}

		document.addEventListener('pointerdown', closeOnOutsidePress)
		document.addEventListener('keydown', closeOnEscape)
		return () => {
			document.removeEventListener('pointerdown', closeOnOutsidePress)
			document.removeEventListener('keydown', closeOnEscape)
		}
	}, [isOpen])

	function openOnHover(event) {
		if (event.pointerType === 'mouse') {
			setOpenedBy((current) => current ?? 'hover')
		}
	}

	function closeAfterHover(event) {
		if (
			event.pointerType !== 'mouse' ||
			list.current.contains(document.activeElement)
		)
			return
		setOpenedBy((current) => (current === 'hover' ? null : current))
	}

	function closeOnFocusOut(event) {
		if (!event.currentTarget.contains(event.relatedTarget))
			setOpenedBy(null)
	}

	return (
		<div
			ref={dropdown}
			className={styles.dropdown}
			onPointerEnter={openOnHover}
			onPointerLeave={closeAfterHover}
			onBlur={closeOnFocusOut}
		>
			<button
				ref={button}
				className={buttonClassName}
				type="button"
				aria-expanded={isOpen}
				aria-controls={listId}
				onClick={() =>
					setOpenedBy((current) =>
						current === 'press' ? null : 'press',
					)
				}
			>
				{label}
				<span className={styles.chevron} aria-hidden="true" />
			</button>
			<ul
				ref={list}
				id={listId}
				className={styles.links}
				hidden={!isOpen}
			>
				{links.map(({ label, to }) => (
					<li key={to}>
						<Link to={to} onClick={() => setOpenedBy(null)}>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</div>
	)
}
