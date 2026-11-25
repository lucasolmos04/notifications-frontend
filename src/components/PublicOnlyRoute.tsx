import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../auth/useAuth'

// Login y registro: con sesión iniciada no tiene sentido verlos.
export function PublicOnlyRoute() {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}
