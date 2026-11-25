import { useEffect, useState } from 'react'
import { getErrorMessage } from '../api/errorMessage'
import { createNotification, listNotifications } from '../api/notifications'
import { useAuth } from '../auth/useAuth'
import { NotificationForm } from '../components/NotificationForm'
import { NotificationList } from '../components/NotificationList'
import type { Notification } from '../types'

export function NotificationsPage() {
  const { logout } = useAuth()
  // null mientras la lista no se haya cargado.
  const [notifications, setNotifications] = useState<Notification[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Cambiarlo vuelve a ejecutar el efecto (botón "Reintentar").
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Descarta la respuesta si el componente se desmontó o se reintentó.
    let ignore = false
    listNotifications()
      .then((data) => {
        if (!ignore) setNotifications(data)
      })
      .catch((err) => {
        if (!ignore) setError(getErrorMessage(err))
      })
    return () => {
      ignore = true
    }
  }, [attempt])

  function retry() {
    setError(null)
    setAttempt((current) => current + 1)
  }

  function renderContent() {
    if (error) {
      return (
        <>
          <p role="alert">{error}</p>
          <button type="button" onClick={retry}>
            Reintentar
          </button>
        </>
      )
    }
    if (notifications === null) return <p role="status">Cargando…</p>

    // El formulario aparece con la lista ya cargada, para que una respuesta
    // tardía de la lista no pise una notificación recién creada.
    return (
      <>
        <NotificationForm
          heading="Nueva notificación"
          submitLabel="Crear notificación"
          submittingLabel="Creando…"
          onSubmit={async (input) => {
            const created = await createNotification(input)
            setNotifications((current) => [created, ...(current ?? [])])
          }}
        />
        <h2>Historial</h2>
        <NotificationList
          notifications={notifications}
          onUpdated={(updated) =>
            setNotifications(
              (current) => current?.map((n) => (n.id === updated.id ? updated : n)) ?? null,
            )
          }
          onDeleted={(id) =>
            setNotifications((current) => current?.filter((n) => n.id !== id) ?? null)
          }
        />
      </>
    )
  }

  return (
    <main>
      <h1>Mis notificaciones</h1>
      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
      {renderContent()}
    </main>
  )
}
