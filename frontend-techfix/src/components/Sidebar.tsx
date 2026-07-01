import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const isAdmin = user?.role?.nombre === 'Administrador'

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Clientes', path: '/clientes' },
    { label: 'Equipos', path: '/equipos' },
    { label: 'Órdenes', path: '/ordenes' },
    { label: 'Inventario', path: '/componentes' },
    { label: 'Alertas Stock', path: '/alertas-stock' },
    ...(isAdmin ? [{ label: 'Actividades', path: '/actividades' }, { label: 'Tipos Servicio', path: '/tipos-servicio' }, { label: 'Usuarios', path: '/usuarios' }] : []),
    { label: 'Reportes', path: '/reportes/financieros' },
    { label: 'Dashboard Ingresos', path: '/dashboard/ingresos' },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-4 flex flex-col">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-primary">TechFix DSS</h1>
      </div>

      <nav className="space-y-1 flex-1">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === item.path
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border pt-4">
        <div className="text-sm text-foreground font-medium">{user?.name} {user?.apellido}</div>
        <div className="text-xs text-muted-foreground">{user?.role?.nombre}</div>
        <button
          onClick={logout}
          className="mt-2 w-full px-3 py-1.5 bg-destructive/10 text-destructive rounded-lg text-xs font-medium hover:bg-destructive/20 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
