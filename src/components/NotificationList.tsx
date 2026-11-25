import type { Notification } from '../types'
import { CHANNEL_LABELS, STATUS_LABELS } from './labels'

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return <p>Todavía no tienes notificaciones.</p>
  }

  return (
    <ul>
      {notifications.map((notification) => (
        <li key={notification.id}>
          <h3>{notification.title}</h3>
          <p>{notification.content}</p>
          <small>
            Canal: {CHANNEL_LABELS[notification.channel]} · Estado:{' '}
            {STATUS_LABELS[notification.status]}
          </small>
        </li>
      ))}
    </ul>
  )
}
