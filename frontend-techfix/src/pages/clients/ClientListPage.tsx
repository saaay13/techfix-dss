import { useEffect, useState } from 'react'
import { getClients, createClient, updateClient, getClient, deleteClient } from '../../services/clients'
import Modal from '../../components/Modal'

interface Client {
  id: number
  nombre: string
  apellido: string
  telefono: string
  correo: string
  ci: string
  activo: boolean
}

const emptyForm = { nombre: '', apellido: '', telefono: '', correo: '', ci: '', activo: true }

export default function ClientListPage() {
  const [clients, setClients] = useState<Client[] | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const fetchClients = async (s = '') => {
    try {
      const data = await getClients(s)
      setClients(data.data || [])
    } catch {
      setError('Error al cargar clientes')
    }
  }

  useEffect(() => { fetchClients() }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setModal(true)
  }

  const openEdit = async (id: number) => {
    try {
      const client = await getClient(id)
      setEditingId(id)
      setForm({
        nombre: client.nombre,
        apellido: client.apellido,
        telefono: client.telefono,
        correo: client.correo,
        ci: client.ci,
        activo: client.activo,
      })
      setFormErrors({})
      setModal(true)
    } catch {
      setError('Error al cargar cliente')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors({})
    try {
      if (editingId) {
        await updateClient(editingId, form)
      } else {
        await createClient(form)
      }
      setModal(false)
      fetchClients(search)
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setFormErrors(fieldErrors)
      } else {
        setFormErrors({ general: err.message || 'Error al guardar cliente' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Desactivar al cliente "${name}"?`)) return
    try {
      await deleteClient(id)
      fetchClients(search)
    } catch {
      setError('Error al desactivar cliente')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Clientes</h2>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          + Nuevo Cliente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{error}</div>
      )}

      <input
        placeholder="Buscar cliente por nombre, teléfono o correo..."
        value={search}
        onChange={e => { setSearch(e.target.value); fetchClients(e.target.value) }}
        className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground mb-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
      />

      {clients === null ? null : clients.length === 0 ? (
        <p className="text-muted-foreground">No hay clientes registrados</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Teléfono</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Correo</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">CI</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{client.nombre} {client.apellido}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.telefono}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.correo}</td>
                  <td className="px-4 py-3 text-muted-foreground">{client.ci}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.activo ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {client.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(client.id)} className="px-3 py-1 bg-primary/10 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">Editar</button>
                    {client.activo && (
                      <button onClick={() => handleDelete(client.id, `${client.nombre} ${client.apellido}`)} className="px-3 py-1 bg-error/10 text-error rounded-lg text-xs font-medium hover:bg-error/20 transition-colors">Desactivar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editingId ? 'Editar Cliente' : 'Nuevo Cliente'}>
        {formErrors.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{formErrors.general}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
            <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.nombre ? 'border-error' : 'border-input'}`} />
            {formErrors.nombre && <p className="mt-1 text-xs text-error">{formErrors.nombre}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Apellido</label>
            <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.apellido ? 'border-error' : 'border-input'}`} />
            {formErrors.apellido && <p className="mt-1 text-xs text-error">{formErrors.apellido}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
            <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.telefono ? 'border-error' : 'border-input'}`} />
            {formErrors.telefono && <p className="mt-1 text-xs text-error">{formErrors.telefono}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Correo electrónico</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.correo ? 'border-error' : 'border-input'}`} />
            {formErrors.correo && <p className="mt-1 text-xs text-error">{formErrors.correo}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">CI</label>
            <input type="text" name="ci" value={form.ci} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.ci ? 'border-error' : 'border-input'}`} />
            {formErrors.ci && <p className="mt-1 text-xs text-error">{formErrors.ci}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} className="h-4 w-4 rounded border-input text-primary focus:ring-primary/50" />
            <label className="text-sm text-foreground">Activo</label>
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
