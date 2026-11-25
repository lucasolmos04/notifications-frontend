import { useAuth } from '../auth/useAuth'

export function NotificationsPage() {
  const { logout } = useAuth()

  return (
    <main>
      <h1>Mis notificaciones</h1>
      <button type="button" onClick={logout}>
        Cerrar sesión
      </button>
    </main>
  )
}
