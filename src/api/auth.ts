import type { LoginInput, LoginResponse, RegisterInput, User } from '../types'
import { request } from './client'

export function login(input: LoginInput): Promise<LoginResponse> {
  return request<LoginResponse>('/login', { method: 'POST', body: input, auth: false })
}

export function register(input: RegisterInput): Promise<User> {
  return request<User>('/register', { method: 'POST', body: input, auth: false })
}
