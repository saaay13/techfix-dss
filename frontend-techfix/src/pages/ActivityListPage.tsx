import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface Activity {
  id: number
  nombre: string
  activo: boolean
}

export default function ActivityListPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const fetchActivities = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/activities')
      setActivities(data)
    } catch {
      setError('Error al cargar actividades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchActivities() }, [])

  const handleDelete = async (id: number, nombre: string) => {
    if (!confirm(`¿Desactivar la actividad "${nombre}"?`)) return
    try {
      await api.delete(`/activities/${id}`)
      fetchActivities()
    } catch {
      setError('Error al desactivar actividad')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Actividades</h2>
        <button
          onClick={() => navigate('/actividades/nueva')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          + Nueva Actividad
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">{error}</div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : activities.length === 0 ? (
        <p className="text-muted-foreground">No hay actividades registradas</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activities.map(activity => (
                <tr key={activity.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{activity.nombre}</td>
                  <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      activity.activo
                        ? 'bg-success/10 text-success'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {activity.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button
                      onClick={() => navigate(`/actividades/${activity.id}/editar`)}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                    >
                      Editar
                    </button>
                    {activity.activo && (
                      <button
                        onClick={() => handleDelete(activity.id, activity.nombre)}
                        className="px-3 py-1 bg-destructive/10 text-destructive rounded-lg text-xs font-medium hover:bg-destructive/20 transition-colors"
                      >
                        Desactivar
                      </button>
                    )}
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
