import React, { useEffect, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '../../store'
import { removeNotification, markAsRead } from '../../store/slices/notificationSlice'
import { X } from 'lucide-react'

export const NotificationToaster: React.FC = () => {
  const notifications = useAppSelector(state => state.notifications.notifications)
  const dispatch = useAppDispatch()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        const latest = notifications[0]
        dispatch(markAsRead(latest.id))
        dispatch(removeNotification(latest.id))
      }, 3500)
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }
  }, [notifications, dispatch])

  if (notifications.length === 0) return null

  const latest = notifications[0]
  const colorMap: Record<string, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-yellow-500',
    info: 'bg-blue-600',
  }

  const handleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    dispatch(markAsRead(latest.id))
    dispatch(removeNotification(latest.id))
  }

  return (
    <div className="fixed top-6 right-6 z-50">
      <div className={`flex items-start max-w-xs w-full shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 ${colorMap[latest.type] || 'bg-gray-800'} text-white`}>
        <div className="flex-1 p-4">
          <p className="font-semibold">{latest.title}</p>
          <p className="text-sm mt-1">{latest.message}</p>
        </div>
        <button
          className="p-2 text-white hover:text-gray-200"
          onClick={handleClose}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
