import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError('Demasiados intentos. Intenta de nuevo en un minuto.')
      } else if (err.response?.status === 401 || err.response?.status === 422) {
        setError('Credenciales incorrectas')
      } else {
        setError('Error de conexión con el servidor')
      }
    }
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-gradient-to-br from-primary-50 via-background to-secondary-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary-600">TechFix DSS</h1>
            <p className="text-muted-foreground text-sm mt-1">Sistema de Gestión de Servicios Técnicos</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Correo electrónico</label>
              <input
                type="email"
                placeholder="admin@techfix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-input rounded-lg text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 border border-input rounded-lg text-sm bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          &copy; {new Date().getFullYear()} TechFix DSS. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
