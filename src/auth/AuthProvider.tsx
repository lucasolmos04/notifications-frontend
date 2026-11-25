import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { login as loginRequest } from '../api/auth'
import { setUnauthorizedHandler } from '../api/client'
import type { LoginInput } from '../types'
import { AuthContext } from './authContext'
import { clearToken, getToken, setToken } from './tokenStorage'

export function AuthProvider({ children }: { children: ReactNode }) {
  // Se lee del storage una sola vez, así la sesión sobrevive a una recarga.
  const [token, setTokenState] = useState(getToken)

  // Si el backend responde 401, el cliente HTTP ya borró el token guardado;
  // acá actualizamos el estado y ProtectedRoute redirige a /login.
  useEffect(() => {
    setUnauthorizedHandler(() => setTokenState(null))
    return () => setUnauthorizedHandler(null)
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const response = await loginRequest(input)
    setToken(response.token)
    setTokenState(response.token)
  }, [])

  // El JWT es stateless: cerrar sesión es solo borrar el token.
  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
  }, [])

  const value = useMemo(
    () => ({ isAuthenticated: token !== null, login, logout }),
    [token, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}
