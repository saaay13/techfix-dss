import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-svh flex items-center justify-center text-muted-foreground">Cargando...</div>
  return user ? <>{children}</> : <Navigate to="/login" />
}
