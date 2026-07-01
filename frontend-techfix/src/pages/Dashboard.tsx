import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCriticalStock } from '../services/api'

interface CriticalComponent {
  id: number
  nombre: string
  cantidad: number
  stock_minimo: number
}

export default function Dashboard() {
  const { user } = useAuth()
  const [criticalCount, setCriticalCount] = useState(0)
  const [criticalComponents, setCriticalComponents] = useState<CriticalComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCriticalStock()
      .then((data: CriticalComponent[]) => {
        setCriticalComponents(data)
        setCriticalCount(data.length)
      })
      .catch(() => setError('Error al cargar stock crítico'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        Bienvenido, {user?.name} {user?.apellido}
      </h1>
      <p className="text-muted-foreground mb-6">
        Rol: <span className="font-medium text-primary">{user?.role?.nombre}</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['Órdenes de Servicio', 'Clientes', 'Inventario'].map((title) => (
          <div key={title} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">Módulo próximamente</p>
          </div>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">{error}</div>
      )}

      {!loading && criticalCount > 0 && (
        <div className="bg-card border border-destructive/40 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-destructive/5 border-b border-destructive/20 flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-destructive rounded-full animate-pulse" />
            <p className="text-sm text-destructive font-semibold">
              Stock Crítico — {criticalCount} componente{criticalCount !== 1 ? 's' : ''} por debajo del mínimo
            </p>
          </div>
          <div className="p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-3 py-2 font-medium text-foreground">Componente</th>
                  <th className="text-center px-3 py-2 font-medium text-foreground">Stock</th>
                  <th className="text-center px-3 py-2 font-medium text-foreground">Mínimo</th>
                  <th className="text-center px-3 py-2 font-medium text-foreground">Estado</th>
                </tr>
              </thead>
              <tbody>
                {criticalComponents.map(c => (
                  <tr key={c.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 text-foreground font-medium">{c.nombre}</td>
                    <td className="px-3 py-2 text-center font-bold text-destructive">{c.cantidad}</td>
                    <td className="px-3 py-2 text-center text-muted-foreground">{c.stock_minimo}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="px-2 py-0.5 bg-destructive/10 text-destructive rounded-full text-xs font-medium">
                        {c.cantidad === 0 ? 'Agotado' : 'Crítico'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
