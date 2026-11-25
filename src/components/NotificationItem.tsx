import { useState } from 'react'
import { ApiError } from '../api/client'
import { getErrorMessage } from '../api/errorMessage'
import { deleteNotification, updateNotification } from '../api/notifications'
import type { Notification } from '../types'
import { CHANNEL_LABELS, STATUS_LABELS } from './labels'
import { NotificationForm } from './NotificationForm'

interface Props {
  notification: Notification
  onUpdated: (notification: Notification) => void
  onDeleted: (id: string) => void
}

export function NotificationItem({ notification, onUpdated, onDeleted }: Props) {
  const { id, title, content, channel, status } = notification
  const [editing, setEditing] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!window.confirm(`¿Eliminar la notificación "${title}"?`)) return

    setError(null)
    setDeleting(true)
    try {
      await deleteNotification(id)
      onDeleted(id)
    } catch (err) {
      // 404: ya no existe (por ejemplo, se borró en otra pestaña), la quitamos.
      if (err instanceof ApiError && err.status === 404) {
        onDeleted(id)
        return
      }
      setError(getErrorMessage(err))
      setDeleting(false)
    }
  }

  if (editing) {
    return (
      <li className="card">
        <NotificationForm
          heading="Editar notificación"
          submitLabel="Guardar cambios"
          submittingLabel="Guardando…"
          initialValues={{ title, content, channel }}
          onSubmit={async (input) => {
            onUpdated(await updateNotification(id, input))
            setEditing(false)
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    )
  }

  return (
    <li className="card">
      <div className="item-header">
        <h3>{title}</h3>
        <span className={`badge badge-${status}`}>{STATUS_LABELS[status]}</span>
      </div>
      <p className="item-content">{content}</p>
      <small>Canal: {CHANNEL_LABELS[channel]}</small>
      <div className="actions">
        <button
          type="button"
          className="secondary"
          disabled={deleting}
          onClick={() => {
            setError(null)
            setEditing(true)
          }}
        >
          Editar
        </button>
        <button type="button" className="danger" disabled={deleting} onClick={handleDelete}>
          {deleting ? 'Eliminando…' : 'Eliminar'}
        </button>
      </div>
      {error && <p role="alert">{error}</p>}
    </li>
  )
}
