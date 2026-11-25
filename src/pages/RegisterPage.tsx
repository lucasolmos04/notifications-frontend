import { useState, type ChangeEvent, type SubmitEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { register } from '../api/auth'
import { getErrorMessage } from '../api/errorMessage'
import { getOrCreateDeviceToken } from '../auth/deviceToken'
import { useAuth } from '../auth/useAuth'

const EMPTY_FORM = { name: '', last_name: '', email: '', password: '', phone_number: '' }

export function RegisterPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Props comunes de cada input; "field" coincide con el campo de la API.
  function bind(field: keyof typeof EMPTY_FORM) {
    return {
      name: field,
      value: form[field],
      onChange: (e: ChangeEvent<HTMLInputElement>) =>
        setForm((current) => ({ ...current, [field]: e.target.value })),
    }
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const name = form.name.trim()
    const last_name = form.last_name.trim()
    // El backend no valida campos vacíos, y "required" deja pasar solo espacios.
    if (!name || !last_name) {
      setError('Completa tu nombre y apellido.')
      return
    }

    setSubmitting(true)
    try {
      await register({
        ...form,
        name,
        last_name,
        phone_number: form.phone_number.trim(),
        device_token: getOrCreateDeviceToken(),
      })
    } catch (err) {
      setError(getErrorMessage(err, { 409: 'Ese email ya está registrado.' }))
      setSubmitting(false)
      return
    }

    // /register no devuelve token: iniciamos sesión con los mismos datos.
    try {
      await login({ email: form.email, password: form.password })
    } catch {
      // La cuenta ya existe, así que no tiene sentido reenviar el registro.
      navigate('/login', { state: { notice: 'Cuenta creada. Inicia sesión para continuar.' } })
    }
  }

  return (
    <main className="auth">
      <h1>Crear cuenta</h1>
      <form className="card" onSubmit={handleSubmit}>
        <label>
          Nombre
          <input {...bind('name')} autoComplete="given-name" required />
        </label>
        <label>
          Apellido
          <input {...bind('last_name')} autoComplete="family-name" required />
        </label>
        <label>
          Email
          <input {...bind('email')} type="email" autoComplete="email" required />
        </label>
        <label>
          Contraseña (mínimo 8 caracteres)
          <input
            {...bind('password')}
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <label>
          Teléfono (opcional, necesario para SMS)
          <input {...bind('phone_number')} type="tel" autoComplete="tel" />
        </label>
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
      <Link to="/login">Ya tengo cuenta</Link>
    </main>
  )
}
