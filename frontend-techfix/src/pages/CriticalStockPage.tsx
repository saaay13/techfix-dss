import { useEffect, useState } from 'react'
import { getCriticalStock } from '../services/api'

interface CriticalComponent {
  id: number
  nombre: string
  descripcion: string
  cantidad: number
  stock_minimo: number
  category: { id: number; nombre: string }
}

export default function CriticalStockPage() {
  const [components, setComponents] = useState<CriticalComponent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getCriticalStock()
      .then(setComponents)
      .catch(() => setError('Error al cargar alertas de stock'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
        <h2 className="text-2xl font-semibold text-foreground">Alertas de Stock Crítico</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : components.length === 0 ? (
        <div className="p-8 bg-card border border-border rounded-xl shadow-sm text-center">
          <p className="text-success font-medium">No hay componentes con stock crítico</p>
          <p className="text-sm text-muted-foreground mt-1">Todos los componentes tienen suficiente inventario</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-destructive/5 border-b border-destructive/20">
            <p className="text-sm text-destructive font-medium">
              {components.length} componente{components.length !== 1 ? 's' : ''} por debajo del stock mínimo
            </p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">Componente</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Categoría</th>
                <th className="text-center px-4 py-3 font-medium text-foreground">Stock Actual</th>
                <th className="text-center px-4 py-3 font-medium text-foreground">Stock Mínimo</th>
                <th className="text-center px-4 py-3 font-medium text-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {components.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-destructive/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{c.nombre}</div>
                    {c.descripcion && (
                      <div className="text-xs text-muted-foreground mt-0.5">{c.descripcion}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{c.category?.nombre || '-'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-destructive text-lg">{c.cantidad}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{c.stock_minimo}</td>
                  <td className="px-4 py-3 text-center">
                    <span className="px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-medium">
                      {c.cantidad === 0 ? 'Agotado' : 'Crítico'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
