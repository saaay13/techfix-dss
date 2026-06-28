import { useEffect, useState } from 'react'
import { getComponents, getComponent, createComponent, updateComponent, deleteComponent } from '../services/api'
import Modal from '../components/Modal'

interface Component {
  id: number
  nombre: string
  descripcion: string | null
  cantidad: number
  stock_minimo: number | null
  precio_unitario: number
  activo: boolean
}

const emptyForm = { nombre: '', descripcion: '', cantidad: 1, precio_unitario: 0 }

export default function ComponentListPage() {
  const [components, setComponents] = useState<Component[] | null>(null)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const fetchComponents = async () => {
    try {
      const data = await getComponents()
      setComponents(Array.isArray(data) ? data : data.data || [])
    } catch {
      setError('Error al cargar componentes')
    }
  }

  useEffect(() => { fetchComponents() }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setModal(true)
  }

  const openEdit = async (id: number) => {
    try {
      const component = await getComponent(id)
      setEditingId(id)
      setForm({
        nombre: component.nombre,
        descripcion: component.descripcion || '',
        cantidad: component.cantidad,
        precio_unitario: Number(component.precio_unitario),
      })
      setFormErrors({})
      setModal(true)
    } catch {
      setError('Error al cargar componente')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: name === 'cantidad' || name === 'precio_unitario' ? Number(value) : value,
    }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors({})
    try {
      if (editingId) {
        await updateComponent(editingId, form)
      } else {
        await createComponent(form)
      }
      setModal(false)
      fetchComponents()
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setFormErrors(fieldErrors)
      } else {
        setFormErrors({ general: err.message || 'Error al guardar componente' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Eliminar componente "${name}"?`)) return
    try {
      await deleteComponent(id)
      fetchComponents()
    } catch {
      setError('Error al eliminar componente')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Inventario de Componentes</h2>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          + Nuevo Componente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{error}</div>
      )}

      {components === null ? null : components.length === 0 ? (
        <p className="text-muted-foreground">No hay componentes registrados</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Descripción</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Cantidad</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Precio Unit.</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Stock Mín.</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {components.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-medium">{c.nombre}</td>
                  <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">{c.descripcion || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      c.cantidad <= (c.stock_minimo || 0) ? 'bg-error/10 text-error' : 'bg-success/10 text-success'
                    }`}>
                      {c.cantidad}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Bs. {Number(c.precio_unitario).toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{c.stock_minimo ?? '—'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(c.id)} className="px-3 py-1 bg-primary/10 text-primary-600 rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors">Editar</button>
                    <button onClick={() => handleDelete(c.id, c.nombre)} className="px-3 py-1 bg-error/10 text-error rounded-lg text-xs font-medium hover:bg-error/20 transition-colors">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editingId ? 'Editar Componente' : 'Nuevo Componente'}>
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
            <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
            <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={2}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Cantidad</label>
            <input type="number" name="cantidad" value={form.cantidad} onChange={handleChange} required min={1}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.cantidad ? 'border-error' : 'border-input'}`} />
            {formErrors.cantidad && <p className="mt-1 text-xs text-error">{formErrors.cantidad}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Precio Unitario (Bs.)</label>
            <input type="number" name="precio_unitario" value={form.precio_unitario} onChange={handleChange} required min={0} step={0.01}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.precio_unitario ? 'border-error' : 'border-input'}`} />
            {formErrors.precio_unitario && <p className="mt-1 text-xs text-error">{formErrors.precio_unitario}</p>}
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
