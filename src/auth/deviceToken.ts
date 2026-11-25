// Simula el token que daría el SDK de push de un dispositivo real.
// Se genera una sola vez por navegador y se reutiliza.

const DEVICE_TOKEN_KEY = 'device_token'

export function getOrCreateDeviceToken(): string {
  let token = localStorage.getItem(DEVICE_TOKEN_KEY)
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem(DEVICE_TOKEN_KEY, token)
  }
  return token
}
