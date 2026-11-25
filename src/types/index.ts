// Tipos que describen el contrato de la API del backend.

export type Channel = 'email' | 'sms' | 'push'
export type Status = 'pending' | 'sent' | 'failed'

export interface Notification {
  id: string
  title: string
  content: string
  channel: Channel
  status: Status
}

// Body de POST /notifications y PUT /notifications/{id}
export interface NotificationInput {
  title: string
  content: string
  channel: Channel
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface RegisterInput {
  name: string
  last_name: string
  email: string
  password: string
  phone_number?: string
  device_token?: string
}

export interface User {
  id: string
  name: string
  last_name: string
  email: string
  phone_number: string
  device_token: string
}
