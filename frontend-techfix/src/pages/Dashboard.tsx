import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Bienvenido, {user?.name} {user?.apellido}
      </h1>
      <p className="text-muted-foreground mb-6">
        Rol: <span className="font-medium text-primary">{user?.role?.nombre}</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['Órdenes de Servicio', 'Clientes', 'Inventario'].map((title) => (
          <div key={title} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">Módulo próximamente</p>
          </div>
        ))}
      </div>
    </div>
  )
}
