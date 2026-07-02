import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDevices, getDevice, createDevice, updateDevice, deleteDevice, getDeviceTypes, getPhysicalStates } from '../../services/devices'
import { getClients } from '../../services/clients'
import Modal from '../../components/Modal'

interface Device {
  id: number
  tipo_equipo: string
  marca: string
  modelo: string
  numero_serie: string
  estado_fisico: string | null
  activo: boolean
  client_id: number
  client: { id: number; nombre: string; apellido: string }
}

interface Client {
  id: number
  nombre: string
  apellido: string
}

const emptyForm = { tipo_equipo: '', marca: '', modelo: '', numero_serie: '', estado_fisico: '', client_id: 0 }

export default function DeviceListPage() {
  const navigate = useNavigate()
  const [devices, setDevices] = useState<Device[] | null>(null)
  const [clients, setClients] = useState<Client[]>([])
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const deviceTypes = getDeviceTypes()
  const physicalStates = getPhysicalStates()

  const fetchDevices = async () => {
    try {
      const data = await getDevices()
      setDevices(Array.isArray(data) ? data : data.data || [])
    } catch {
      setError('Error al cargar equipos')
    }
  }

  const fetchClients = async () => {
    try {
      const data = await getClients()
      setClients(data.data || data)
    } catch {}
  }

  useEffect(() => { fetchDevices(); fetchClients() }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setModal(true)
  }

  const openEdit = async (id: number) => {
    try {
      const device = await getDevice(id)
      setEditingId(id)
      setForm({
        tipo_equipo: device.tipo_equipo,
        marca: device.marca,
        modelo: device.modelo,
        numero_serie: device.numero_serie,
        estado_fisico: device.estado_fisico || '',
        client_id: device.client_id,
      })
      setFormErrors({})
      setModal(true)
    } catch {
      setError('Error al cargar equipo')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === 'client_id' ? Number(value) : value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors({})
    try {
      if (editingId) {
        await updateDevice(editingId, form)
      } else {
        await createDevice(form)
      }
      setModal(false)
      fetchDevices()
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setFormErrors(fieldErrors)
      } else {
        setFormErrors({ general: err.message || 'Error al guardar equipo' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Desactivar equipo "${name}"?`)) return
    try {
      await deleteDevice(id)
      fetchDevices()
    } catch {
      setError('Error al desactivar equipo')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Equipos</h2>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          + Nuevo Equipo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{error}</div>
      )}

      {devices === null ? null : devices.length === 0 ? (
        <p className="text-muted-foreground">No hay equipos registrados</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">Cliente</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Tipo</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Marca</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Modelo</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Serie</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {devices.map(device => (
                <tr key={device.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{device.client?.nombre} {device.client?.apellido}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary-600">
                      {device.tipo_equipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{device.marca}</td>
                  <td className="px-4 py-3 text-muted-foreground">{device.modelo}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{device.numero_serie}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      device.activo ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {device.activo ? (device.estado_fisico || 'Activo') : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => navigate(`/equipos/${device.id}/historial`)} title="Ver historial de servicios"
                      className="inline-flex items-center gap-1 whitespace-nowrap px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-xs font-medium hover:bg-purple-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
                      Historial
                    </button>
                    <button onClick={() => openEdit(device.id)} className="px-3 py-1 bg-primary/10 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">Editar</button>
                    {device.activo && (
                      <button onClick={() => handleDelete(device.id, `${device.marca} ${device.modelo}`)} className="px-3 py-1 bg-error/10 text-error rounded-lg text-xs font-medium hover:bg-error/20 transition-colors">Desactivar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editingId ? 'Editar Equipo' : 'Nuevo Equipo'}>
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
            <label className="block text-sm font-medium text-foreground mb-1">Tipo de Equipo</label>
            <select name="tipo_equipo" value={form.tipo_equipo} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.tipo_equipo ? 'border-error' : 'border-input'}`}>
              <option value="">Seleccionar tipo</option>
              {deviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {formErrors.tipo_equipo && <p className="mt-1 text-xs text-error">{formErrors.tipo_equipo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Marca</label>
            <input type="text" name="marca" value={form.marca} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.marca ? 'border-error' : 'border-input'}`} />
            {formErrors.marca && <p className="mt-1 text-xs text-error">{formErrors.marca}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Modelo</label>
            <input type="text" name="modelo" value={form.modelo} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.modelo ? 'border-error' : 'border-input'}`} />
            {formErrors.modelo && <p className="mt-1 text-xs text-error">{formErrors.modelo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Número de Serie</label>
            <input type="text" name="numero_serie" value={form.numero_serie} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.numero_serie ? 'border-error' : 'border-input'}`} />
            {formErrors.numero_serie && <p className="mt-1 text-xs text-error">{formErrors.numero_serie}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Estado Físico
              <span title="Bueno: funciona correctamente, Regular: detalles menores, Malo: no funciona" className="ml-1 text-muted-foreground cursor-help">ⓘ</span>
            </label>
            <select name="estado_fisico" value={form.estado_fisico} onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="">Sin especificar</option>
              {physicalStates.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
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
    </div>
  )
}
