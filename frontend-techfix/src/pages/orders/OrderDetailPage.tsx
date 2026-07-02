import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getServiceOrder } from '../../services/orders'
import api from '../../services/api'

interface ActivityLog {
  id: number
  activity_id: number
  descripcion_personalizada: string | null
  completed: boolean
  user: { id: number; name: string }
  activity: { id: number; nombre: string }
}

interface ServiceOrderItem {
  id: number
  service_type_id: number
  descripcion: string | null
  precio: number
  service_type: { id: number; nombre: string }
  activity_logs: ActivityLog[]
}

interface StatusHistory {
  id: number
  estado_anterior: string
  estado_nuevo: string
  nota: string | null
  created_at: string
}

interface ServiceOrder {
  id: number
  fecha_ingreso: string
  fecha_entrega: string | null
  diagnostico_inicial: string
  estado: string
  prioridad: string
  fecha_estimada_entrega: string | null
  observaciones: string | null
  costo_total: number
  client: { id: number; nombre: string; apellido: string; telefono: string }
  device: { id: number; tipo_equipo: string; marca: string; modelo: string; numero_serie: string }
  user: { id: number; name: string; apellido: string }
  items: ServiceOrderItem[]
  status_histories: StatusHistory[]
}

const ESTADO_COLOR: Record<string, string> = {
  Recibido: 'bg-blue-100 text-blue-800',
  Diagnóstico: 'bg-purple-100 text-purple-800',
  'En reparación': 'bg-orange-100 text-orange-800',
  Finalizado: 'bg-success/10 text-success',
  Entregado: 'bg-muted text-muted-foreground',
}

const PRIORIDAD_COLOR: Record<string, string> = {
  Baja: 'bg-success/10 text-success',
  Media: 'bg-yellow-100 text-yellow-800',
  Alta: 'bg-error/10 text-error',
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [order, setOrder] = useState<ServiceOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [allActivities, setAllActivities] = useState<{ id: number; nombre: string }[]>([])
  const [activityModal, setActivityModal] = useState(false)
  const [activeItemId, setActiveItemId] = useState<number | null>(null)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<number | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderData, actRes] = await Promise.all([
          getServiceOrder(Number(id)),
          api.get('/activities'),
        ])
        setOrder(orderData)
        setAllActivities(actRes.data || [])
      } catch {
        setError('Error al cargar la orden')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const openActivityModal = (itemId: number) => {
    setActiveItemId(itemId)
    setSelectedIds([])
    setActivityModal(true)
  }

  const toggleActivity = (activityId: number) => {
    setSelectedIds(prev => prev.includes(activityId) ? prev.filter(x => x !== activityId) : [...prev, activityId])
  }

  const handleSave = async () => {
    if (!activeItemId || !order) return
    if (selectedIds.length === 0) { setActivityModal(false); return }
    setSaving(true)
    try {
      const res = await api.post(`/service-orders/${order.id}/activities`, {
        activity_ids: selectedIds,
        service_order_item_id: activeItemId,
      })
      const updatedItem = res.data?.item
      if (updatedItem) {
        setOrder(prev => {
          if (!prev) return prev
          return {
            ...prev,
            items: prev.items.map(item =>
              item.id === activeItemId ? { ...item, activity_logs: updatedItem.activity_logs } : item
            ),
          }
        })
      }
      setActivityModal(false)
    } catch (err: any) {
      setError(err.message || 'Error al registrar actividad')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleCompleted = async (activityLogId: number) => {
    if (!order || toggling !== null) return
    setToggling(activityLogId)
    try {
      const res = await api.put(`/service-orders/${order.id}/activity-logs/${activityLogId}/toggle-completed`)
      const updated = res.data?.activity_log
      if (updated) {
        setOrder(prev => {
          if (!prev) return prev
          return {
            ...prev,
            items: prev.items.map(item => ({
              ...item,
              activity_logs: item.activity_logs.map(log =>
                log.id === activityLogId ? { ...log, completed: updated.completed } : log
              ),
            })),
          }
        })
      }
    } catch {
      setError('Error al cambiar estado de actividad')
    } finally {
      setToggling(null)
    }
  }

  const handleRemoveActivity = async (activityLogId: number) => {
    if (!order) return
    try {
      await api.delete(`/service-orders/${order.id}/activity-logs/${activityLogId}`)
      setOrder(prev => {
        if (!prev) return prev
        return {
          ...prev,
          items: prev.items.map(item => ({
            ...item,
            activity_logs: item.activity_logs.filter(log => log.id !== activityLogId),
          })),
        }
      })
    } catch {
      setError('Error al eliminar actividad')
    }
  }

  const availableActivities = (itemId: number) => {
    const item = order?.items.find(i => i.id === itemId)
    const assignedIds = new Set((item?.activity_logs || []).map(l => l.activity_id))
    return allActivities.filter(a => !assignedIds.has(a.id))
  }

  if (loading) return <div className="max-w-5xl mx-auto mt-4 p-4"><p className="text-muted-foreground">Cargando...</p></div>
  if (error) return <div className="max-w-5xl mx-auto mt-4 p-4"><div className="mb-3 p-2 bg-error/10 border border-error/30 text-error rounded text-sm">{error}</div></div>
  if (!order) return <div className="max-w-5xl mx-auto mt-4 p-4"><p className="text-muted-foreground">Orden no encontrada</p></div>

  return (
    <div className="max-w-5xl mx-auto mt-4 p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <button onClick={() => navigate('/ordenes')} className="text-xs text-primary hover:underline">
            ← Volver a Órdenes
          </button>
          <h2 className="text-xl font-semibold text-foreground">Orden #{order.id}</h2>
        </div>
        <div className="flex gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_COLOR[order.estado] || 'bg-muted text-muted-foreground'}`}>
            {order.estado}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${PRIORIDAD_COLOR[order.prioridad] || ''}`}>
            {order.prioridad}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-card border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Cliente</h3>
          <p className="text-sm text-foreground font-medium">{order.client?.nombre} {order.client?.apellido}</p>
          <p className="text-xs text-muted-foreground">{order.client?.telefono}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Equipo</h3>
          <p className="text-sm text-foreground font-medium">{order.device?.tipo_equipo} - {order.device?.marca} {order.device?.modelo}</p>
          <p className="text-xs text-muted-foreground">{order.device?.numero_serie}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Fechas</h3>
          <p className="text-xs text-foreground">Ingreso: <span className="font-medium">{order.fecha_ingreso}</span></p>
          {order.fecha_estimada_entrega && <p className="text-xs text-foreground">Estimada: <span className="font-medium">{order.fecha_estimada_entrega}</span></p>}
          {order.fecha_entrega && <p className="text-xs text-foreground">Entrega: <span className="font-medium">{order.fecha_entrega}</span></p>}
        </div>
        <div className="bg-card border border-border rounded-lg p-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Técnico</h3>
          <p className="text-sm text-foreground">{order.user?.name} {order.user?.apellido}</p>
        </div>
      </div>

      {order.observaciones && (
        <div className="bg-card border border-border rounded-lg p-3 mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Observaciones</h3>
          <p className="text-sm text-foreground">{order.observaciones}</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-lg p-3 mb-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Diagnóstico</h3>
        <p className="text-sm text-foreground">{order.diagnostico_inicial}</p>
      </div>

      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground mb-2">Servicios</h3>
        <div className="space-y-2">
          {order.items?.map(item => {
            const logs = item.activity_logs || []
            const unassigned = availableActivities(item.id)
            return (
              <div key={item.id} className="bg-card border border-border rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.service_type?.nombre}</p>
                    {item.descripcion && <p className="text-xs text-muted-foreground">{item.descripcion}</p>}
                  </div>
                  <p className="text-xs font-mono text-foreground font-medium">Bs. {Number(item.precio).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</p>
                </div>

                <div className="border-t border-border pt-2 mt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actividades</span>
                    {unassigned.length > 0 && (
                      <button onClick={() => openActivityModal(item.id)} className="text-xs text-primary hover:underline">
                        + Agregar actividad
                      </button>
                    )}
                  </div>
                  {logs.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Sin actividades registradas</p>
                  ) : (
                    <div className="space-y-1">
                      {logs.map(log => (
                        <div key={log.id} className="flex items-center gap-2 text-xs bg-muted/20 rounded p-2">
                          <input
                            type="checkbox"
                            checked={log.completed}
                            onChange={() => handleToggleCompleted(log.id)}
                            disabled={toggling === log.id}
                            className="accent-success shrink-0 w-3.5 h-3.5 cursor-pointer"
                          />
                          <span className={`flex-1 min-w-0 ${log.completed ? 'line-through text-muted-foreground' : 'font-medium text-foreground'}`}>
                            {log.activity?.nombre}
                          </span>
                          <span className="text-muted-foreground shrink-0">{log.user?.name}</span>
                          <button
                            onClick={() => handleRemoveActivity(log.id)}
                            className="text-error/60 hover:text-error transition-colors shrink-0 p-0.5"
                            title="Eliminar actividad"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-right mt-2 text-xs text-muted-foreground">
          Total: <span className="font-mono font-semibold text-foreground">Bs. {Number(order.costo_total).toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>

      {order.status_histories && order.status_histories.length > 0 && (
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground mb-2">Historial de Estados</h3>
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-3 py-2 font-medium text-foreground">Anterior</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">Nuevo</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">Nota</th>
                  <th className="text-left px-3 py-2 font-medium text-foreground">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {order.status_histories.map(h => (
                  <tr key={h.id} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 text-muted-foreground">{h.estado_anterior}</td>
                    <td className="px-3 py-2 text-foreground font-medium">{h.estado_nuevo}</td>
                    <td className="px-3 py-2 text-muted-foreground max-w-xs truncate">{h.nota || '—'}</td>
                    <td className="px-3 py-2 text-muted-foreground">{h.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activityModal && activeItemId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setActivityModal(false)}>
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-semibold text-foreground mb-3">Seleccionar Actividades</h3>
            <div className="space-y-3">
              <div className="max-h-60 overflow-y-auto space-y-1 border border-border rounded-lg p-2">
                {availableActivities(activeItemId!).length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-2">No hay más actividades disponibles</p>
                ) : (
                  availableActivities(activeItemId!).map(a => {
                    const checked = selectedIds.includes(a.id)
                    return (
                      <label key={a.id} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm ${checked ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'}`}>
                        <input type="checkbox" checked={checked} onChange={() => toggleActivity(a.id)} className="accent-primary" />
                        {a.nombre}
                      </label>
                    )
                  })
                )}
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={handleSave} disabled={saving || availableActivities(activeItemId!).length === 0}
                  className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button onClick={() => setActivityModal(false)}
                  className="px-3 py-1.5 bg-muted text-muted-foreground rounded text-sm font-medium hover:bg-neutral-300 transition-colors">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
