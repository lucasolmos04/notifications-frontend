import type { Channel, Status } from '../types'

// Textos en español para los valores de la API.
export const CHANNEL_LABELS: Record<Channel, string> = {
  email: 'Email',
  sms: 'SMS',
  push: 'Push',
}

export const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pendiente',
  sent: 'Enviada',
  failed: 'Fallida',
}
