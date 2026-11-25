import { ApiError } from './client'

// Traduce un error a un mensaje para el usuario. Cada pantalla indica
// qué mensaje corresponde a los status que espera.
export function getErrorMessage(error: unknown, byStatus: Record<number, string> = {}): string {
  // Si no es ApiError, normalmente fetch no pudo completar la petición.
  if (!(error instanceof ApiError)) {
    return 'No se pudo conectar con el servidor. Intenta de nuevo.'
  }
  return byStatus[error.status] ?? 'Ocurrió un error en el servidor. Intenta de nuevo.'
}
