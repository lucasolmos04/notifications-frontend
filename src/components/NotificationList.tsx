import type { Notification } from '../types'
import { NotificationItem } from './NotificationItem'

interface Props {
  notifications: Notification[]
  onUpdated: (notification: Notification) => void
  onDeleted: (id: string) => void
}

export function NotificationList({ notifications, onUpdated, onDeleted }: Props) {
  if (notifications.length === 0) {
    return <p>Todavía no tienes notificaciones.</p>
  }

  return (
    <ul>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onUpdated={onUpdated}
          onDeleted={onDeleted}
        />
      ))}
    </ul>
  )
}
