import { useState, type SubmitEvent } from 'react'
import { Link, useLocation } from 'react-router'
import { getErrorMessage } from '../api/errorMessage'
import { useAuth } from '../auth/useAuth'

export function LoginPage() {
  const { login } = useAuth()
  // RegisterPage manda este aviso si creó la cuenta pero falló el login automático.
  const notice: string | undefined = useLocation().state?.notice
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      // Si sale bien, PublicOnlyRoute redirige solo a "/".
      await login({ email, password })
    } catch (err) {
      setError(getErrorMessage(err, { 401: 'Email o contraseña incorrectos.' }))
      setSubmitting(false)
    }
  }

  return (
    <main className="auth">
      <h1>Iniciar sesión</h1>
      {notice && <p role="status">{notice}</p>}
      <form className="card" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Contraseña
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Ingresar'}
        </button>
      </form>
      <Link to="/register">Crear cuenta</Link>
    </main>
  )
}
