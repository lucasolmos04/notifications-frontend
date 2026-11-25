import { clearToken, getToken } from '../auth/tokenStorage'

// Todas las llamadas van a /api/...; el proxy de Vite las manda al backend.
const BASE_URL = '/api'

// Error con el status HTTP y el mensaje que devuelve el backend ({"error": "..."}).
export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// Función que se ejecuta cuando la sesión expira (401 con token enviado).
// La registra el AuthContext para poder redirigir a /login.
let onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  // false para endpoints públicos (login/register): no se manda el token.
  auth?: boolean
}

export async function request<T>(
  path: string,
  { method = 'GET', body, auth = true }: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const token = auth ? getToken() : null
  if (token) headers['Authorization'] = `Bearer ${token}`

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  // Sesión vencida o token inválido: limpiar y avisar a la app.
  // Si no mandamos token (ej. login con credenciales malas) NO es sesión vencida.
  if (response.status === 401 && token) {
    clearToken()
    onUnauthorized?.()
  }

  if (!response.ok) {
    let message = 'Error inesperado'
    try {
      const data = await response.json()
      if (data?.error) message = data.error
    } catch {
      // la respuesta no tenía JSON; dejamos el mensaje genérico
    }
    throw new ApiError(response.status, message)
  }

  // 204 No Content (DELETE): no hay body que parsear.
  if (response.status === 204) return undefined as T

  return (await response.json()) as T
}
