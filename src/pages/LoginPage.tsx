import { Link } from 'react-router'

export function LoginPage() {
  return (
    <main>
      <h1>Iniciar sesión</h1>
      <Link to="/register">Crear cuenta</Link>
    </main>
  )
}
