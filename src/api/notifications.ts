import type { Notification, NotificationInput } from '../types'
import { request } from './client'

export function listNotifications(): Promise<Notification[]> {
  return request<Notification[]>('/notifications')
}

export function createNotification(input: NotificationInput): Promise<Notification> {
  return request<Notification>('/notifications', { method: 'POST', body: input })
}

export function updateNotification(id: string, input: NotificationInput): Promise<Notification> {
  return request<Notification>(`/notifications/${id}`, { method: 'PUT', body: input })
}

export function deleteNotification(id: string): Promise<void> {
  return request<void>(`/notifications/${id}`, { method: 'DELETE' })
}
