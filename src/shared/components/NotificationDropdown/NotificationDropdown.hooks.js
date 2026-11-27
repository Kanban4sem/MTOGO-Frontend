import { useEffect, useRef, useState } from 'react'
import {
	markOrderNotificationAsRead,
	readOrderNotifications,
} from '@/shared/services/orderNotificationService.js'

const POLL_INTERVAL_MS = 30_000

export function useOrderNotifications(enabled, isOpen) {
	const [request, setRequest] = useState({
		notifications: [],
		isLoading: enabled,
		loadError: null,
	})
	const [readError, setReadError] = useState(null)
	const session = useRef(null)
	const { notifications } = request

	useEffect(() => {
		if (!enabled) return

		const controller = new AbortController()
		const { signal } = controller
		session.current = { signal, pendingIds: new Set() }
		let nextPoll

		async function poll() {
			try {
				const latest = await readOrderNotifications(signal)
				if (signal.aborted) return
				setRequest((current) => {
					// A poll started before a successful PUT may still report the old read state.
					const readIds = new Set(
						current.notifications
							.filter(({ read }) => read)
							.map(({ id }) => id),
					)
					return {
						notifications: latest.map((notification) =>
							readIds.has(notification.id)
								? { ...notification, read: true }
								: notification,
						),
						isLoading: false,
						loadError: null,
					}
				})
			} catch (error) {
				if (!signal.aborted)
					setRequest((current) => ({
						...current,
						isLoading: false,
						loadError: error,
					}))
			} finally {
				if (!signal.aborted)
					nextPoll = window.setTimeout(poll, POLL_INTERVAL_MS)
			}
		}

		void poll()
		return () => {
			controller.abort()
			window.clearTimeout(nextPoll)
			session.current = null
		}
	}, [enabled])

	useEffect(() => {
		if (!isOpen || !session.current) return
		const { signal, pendingIds } = session.current
		const unreadIds = notifications
			.filter(({ id, read }) => !read && !pendingIds.has(id))
			.map(({ id }) => id)
		if (!unreadIds.length) return

		for (const id of unreadIds) pendingIds.add(id)

		async function markAsRead() {
			const results = await Promise.allSettled(
				unreadIds.map((id) => markOrderNotificationAsRead(id, signal)),
			)
			if (signal.aborted) return

			const readIds = new Set(
				unreadIds.filter(
					(_, index) => results[index].status === 'fulfilled',
				),
			)
			for (const id of unreadIds) pendingIds.delete(id)
			const failure = results.find(({ status }) => status === 'rejected')
			setReadError(failure?.reason ?? null)
			if (readIds.size > 0)
				setRequest((current) => ({
					...current,
					notifications: current.notifications.map((notification) =>
						readIds.has(notification.id)
							? { ...notification, read: true }
							: notification,
					),
				}))
		}

		void markAsRead()
	}, [isOpen, notifications])

	return { ...request, readError }
}
