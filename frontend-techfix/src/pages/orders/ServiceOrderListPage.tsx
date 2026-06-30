import { useEffect, useState } from 'react'
import { getServiceOrders, getServiceOrder, getServiceTypes, createServiceOrder, updateServiceOrder, deleteServiceOrder, updateServiceOrderStatus } from '../../services/orders'
import { getClients } from '../../services/clients'
import { getClientDevices } from '../../services/devices'
import Modal from '../../components/Modal'

interface ServiceOrder {
  id: number
  fecha_ingreso: string
  diagnostico_inicial: string
  estado: string
  prioridad: string
  fecha_estimada_entrega: string | null
  observaciones: string | null
  costo_total: number
  client_id: number
  device_id: number
  service_type_id: number
  user_id: number
  client: { id: number; nombre: string; apellido: string }
  device: { id: number; tipo_equipo: string; marca: string; modelo: string; numero_serie: string }
  serviceType: { id: number; nombre: string }
  user: { id: number; name: string; apellido: string }
}

interface Client { id: number; nombre: string; apellido: string }
interface DeviceOption { id: number; tipo_equipo: string; marca: string; modelo: string; numero_serie: string }
interface ServiceTypeOption { id: number; nombre: string }

const PRIORIDADES = ['Baja', 'Media', 'Alta']
const ESTADOS = ['Recibido', 'Diagnóstico', 'En reparación', 'Finalizado', 'Entregado']
const PRIORIDAD_COLOR: Record<string, string> = {
  Baja: 'bg-success/10 text-success',
  Media: 'bg-yellow-100 text-yellow-800',
  Alta: 'bg-error/10 text-error',
}
const ESTADO_COLOR: Record<string, string> = {
  Recibido: 'bg-blue-100 text-blue-800',
  Diagnóstico: 'bg-purple-100 text-purple-800',
  'En reparación': 'bg-orange-100 text-orange-800',
  Finalizado: 'bg-success/10 text-success',
  Entregado: 'bg-muted text-muted-foreground',
}

const emptyForm = {
  client_id: 0,
  device_id: 0,
  service_type_id: 0,
  diagnostico_inicial: '',
  prioridad: 'Media',
  estado: 'Recibido',
  fecha_estimada_entrega: '',
  observaciones: '',
}

export default function ServiceOrderListPage() {
  const [orders, setOrders] = useState<ServiceOrder[] | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [devices, setDevices] = useState<DeviceOption[]>([])
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeOption[]>([])
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [statusModal, setStatusModal] = useState(false)
  const [statusOrder, setStatusOrder] = useState<ServiceOrder | null>(null)
  const [statusNote, setStatusNote] = useState('')

  const getNextState = (estado: string) => {
    const map: Record<string, string> = {
      Recibido: 'Diagnóstico',
      Diagnóstico: 'En reparación',
      'En reparación': 'Finalizado',
      Finalizado: 'Entregado',
    }
    return map[estado] || null
  }

  const openStatusModal = (order: ServiceOrder) => {
    setStatusOrder(order)
    setStatusNote('')
    setStatusModal(true)
  }

  const handleAdvanceStatus = async () => {
    if (!statusOrder) return
    const next = getNextState(statusOrder.estado)
    if (!next) return
    try {
      await updateServiceOrderStatus(statusOrder.id, { estado_nuevo: next, nota: statusNote })
      setStatusModal(false)
      setStatusOrder(null)
      fetchOrders()
    } catch (err: any) {
      setError(err.message || 'Error al avanzar estado')
    }
  }

  const fetchOrders = async () => {
    try {
      const data = await getServiceOrders()
      setOrders(Array.isArray(data) ? data : data.data || [])
    } catch {
      setError('Error al cargar órdenes de servicio')
    }
  }

  const fetchClients = async () => {
    try {
      const data = await getClients()
      setClients(data.data || data)
    } catch {}
  }

  const fetchDevicesByClient = async (clientId: number) => {
    if (!clientId) { setDevices([]); return }
    try {
      const data = await getClientDevices(clientId)
      const list: DeviceOption[] = Array.isArray(data) ? data : data.data || []
      setDevices(list)
    } catch {}
  }

  const fetchServiceTypes = async () => {
    try {
      const data = await getServiceTypes()
      setServiceTypes(Array.isArray(data) ? data : [])
    } catch {}
  }

  useEffect(() => { fetchOrders(); fetchClients(); fetchServiceTypes() }, [])

  useEffect(() => {
    if (modal && !editingId && form.client_id) {
      fetchDevicesByClient(form.client_id)
    }
  }, [form.client_id, modal, editingId])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setModal(true)
  }

  const openEdit = async (id: number) => {
    try {
      const order = await getServiceOrder(id)
      setEditingId(id)
      setForm({
        client_id: order.client_id,
        device_id: order.device_id,
        service_type_id: order.service_type_id,
        diagnostico_inicial: order.diagnostico_inicial,
        prioridad: order.prioridad,
        estado: order.estado,
        fecha_estimada_entrega: order.fecha_estimada_entrega || '',
        observaciones: order.observaciones || '',
      })
      setFormErrors({})
      setModal(true)
      await fetchDevicesByClient(order.client_id)
    } catch {
      setError('Error al cargar orden de servicio')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'client_id' || name === 'device_id' || name === 'service_type_id' ? Number(value) : value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors({})
    try {
      if (editingId) {
        await updateServiceOrder(editingId, form)
      } else {
        await createServiceOrder(form)
      }
      setModal(false)
      fetchOrders()
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setFormErrors(fieldErrors)
      } else {
        setFormErrors({ general: err.message || 'Error al guardar orden de servicio' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number, label: string) => {
    if (!confirm(`¿Eliminar la orden de servicio #${label}?`)) return
    try {
      await deleteServiceOrder(id)
      fetchOrders()
    } catch {
      setError('Error al eliminar orden de servicio')
    }
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Órdenes de Servicio</h2>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          + Nueva Orden
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{error}</div>
      )}

      {orders === null ? null : orders.length === 0 ? (
        <p className="text-muted-foreground">No hay órdenes de servicio registradas</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">#</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Equipo</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Servicio</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Prioridad</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Ingreso</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-mono">#{order.id}</td>
                  <td className="px-4 py-3 text-foreground">{order.client?.nombre} {order.client?.apellido}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.device?.tipo_equipo} - {order.device?.marca} {order.device?.modelo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{order.serviceType?.nombre}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_COLOR[order.estado] || 'bg-muted text-muted-foreground'}`}>
                      {order.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${PRIORIDAD_COLOR[order.prioridad] || ''}`}>
                      {order.prioridad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.fecha_ingreso}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {order.estado !== 'Entregado' && (
                      <button onClick={() => openStatusModal(order)} className="px-3 py-1 bg-success/10 text-success rounded-lg text-xs font-medium hover:bg-success/20 transition-colors">Avanzar</button>
                    )}
                    <button onClick={() => openEdit(order.id)} className="px-3 py-1 bg-primary/10 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(order.id, String(order.id))} className="px-3 py-1 bg-error/10 text-error rounded-lg text-xs font-medium hover:bg-error/20 transition-colors">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editingId ? 'Editar Orden de Servicio' : 'Nueva Orden de Servicio'}>
        {formErrors.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{formErrors.general}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Cliente</label>
            <select name="client_id" value={form.client_id} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.client_id ? 'border-error' : 'border-input'}`}>
              <option value={0}>Seleccionar cliente</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
              ))}
            </select>
            {formErrors.client_id && <p className="mt-1 text-xs text-error">{formErrors.client_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Equipo</label>
            <select name="device_id" value={form.device_id} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.device_id ? 'border-error' : 'border-input'}`}>
              <option value={0}>Seleccionar equipo</option>
              {devices.map(d => (
                <option key={d.id} value={d.id}>{d.tipo_equipo} - {d.marca} {d.modelo} ({d.numero_serie})</option>
              ))}
            </select>
            {formErrors.device_id && <p className="mt-1 text-xs text-error">{formErrors.device_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Tipo de Servicio</label>
            <select name="service_type_id" value={form.service_type_id} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.service_type_id ? 'border-error' : 'border-input'}`}>
              <option value={0}>Seleccionar tipo</option>
              {serviceTypes.map(st => (
                <option key={st.id} value={st.id}>{st.nombre}</option>
              ))}
            </select>
            {formErrors.service_type_id && <p className="mt-1 text-xs text-error">{formErrors.service_type_id}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Diagnóstico Inicial</label>
            <textarea name="diagnostico_inicial" value={form.diagnostico_inicial} onChange={handleChange} required rows={3}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.diagnostico_inicial ? 'border-error' : 'border-input'}`} />
            {formErrors.diagnostico_inicial && <p className="mt-1 text-xs text-error">{formErrors.diagnostico_inicial}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Prioridad</label>
            <div className="flex gap-2">
              {PRIORIDADES.map(p => (
                <label key={p} className={`flex-1 text-center px-3 py-2 border-2 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                  form.prioridad === p
                    ? p === 'Baja' ? 'border-success bg-success/10 text-success'
                      : p === 'Media' ? 'border-yellow-400 bg-yellow-50 text-yellow-800'
                      : 'border-error bg-error/10 text-error'
                    : 'border-input bg-background text-muted-foreground hover:bg-muted'
                }`}>
                  <input type="radio" name="prioridad" value={p} checked={form.prioridad === p} onChange={handleChange} className="hidden" />
                  {p}
                </label>
              ))}
            </div>
            {formErrors.prioridad && <p className="mt-1 text-xs text-error">{formErrors.prioridad}</p>}
          </div>
          {editingId && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Estado</label>
              <select name="estado" value={form.estado} onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.estado ? 'border-error' : 'border-input'}`}>
                {ESTADOS.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
              {formErrors.estado && <p className="mt-1 text-xs text-error">{formErrors.estado}</p>}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Fecha Estimada de Entrega</label>
            <input type="date" name="fecha_estimada_entrega" value={form.fecha_estimada_entrega} onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            {formErrors.fecha_estimada_entrega && <p className="mt-1 text-xs text-error">{formErrors.fecha_estimada_entrega}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Observaciones</label>
            <textarea name="observaciones" value={form.observaciones} onChange={handleChange} rows={2}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-neutral-300 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={statusModal} onClose={() => setStatusModal(false)} title="Avanzar Estado">
        {statusOrder && (
          <div className="space-y-4">
            <div className="flex items-center gap-1 text-xs">
              {ESTADOS.map((estado, i) => {
                const currentIdx = ESTADOS.indexOf(statusOrder.estado)
                const nextIdx = currentIdx + 1
                const isActive = i === currentIdx
                const isNext = i === nextIdx
                const isPast = i < currentIdx
                return (
                  <div key={estado} className="flex items-center gap-1 flex-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isPast ? 'bg-success/10 text-success'
                      : isActive ? 'bg-primary/10 text-primary font-bold'
                      : isNext ? 'bg-blue-100 text-blue-800 ring-2 ring-primary/40'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                      {estado}
                    </span>
                    {i < ESTADOS.length - 1 && <div className="h-px flex-1 bg-border" />}
                  </div>
                )
              })}
            </div>

            <div className="p-4 bg-muted/30 rounded-lg text-sm">
              <p className="text-foreground font-medium">Estado actual: <span className="text-primary">{statusOrder.estado}</span></p>
              <p className="text-muted-foreground mt-1">Siguiente: <span className="font-medium text-foreground">{getNextState(statusOrder.estado)}</span></p>
            </div>

            {(getNextState(statusOrder.estado) === 'En reparación' || getNextState(statusOrder.estado) === 'Finalizado') && (
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nota obligatoria</label>
                <textarea
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Describa el trabajo realizado o motivo del cambio..."
                />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button onClick={handleAdvanceStatus} disabled={!getNextState(statusOrder.estado)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
                Avanzar a {getNextState(statusOrder.estado)}
              </button>
              <button onClick={() => setStatusModal(false)}
                className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-neutral-300 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
