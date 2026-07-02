import { useEffect, useState } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categories'
import Modal from '../../components/Modal'

interface Category {
  id: number
  nombre: string
  descripcion: string | null
  activo: boolean
}

const emptyForm = { nombre: '', descripcion: '' }

export default function CategoryListPage() {
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch {
      setError('Error al cargar categorías')
    }
  }

  useEffect(() => { fetchCategories() }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setModal(true)
  }

  const openEdit = async (id: number) => {
    setEditingId(id)
    setFormErrors({})
    try {
      const data = await getCategories()
      const cat = data.find((c: Category) => c.id === id)
      if (cat) {
        setForm({ nombre: cat.nombre, descripcion: cat.descripcion || '' })
      }
    } catch {
      setFormErrors({ general: 'Error al cargar la categoría' })
    }
    setModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('¿Desactivar esta categoría?')) return
    try {
      await deleteCategory(id)
      fetchCategories()
    } catch {
      setError('Error al desactivar categoría')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormErrors({})
    setSaving(true)
    try {
      if (editingId) {
        await updateCategory(editingId, form)
      } else {
        await createCategory(form)
      }
      setModal(false)
      fetchCategories()
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setFormErrors(fieldErrors)
      } else {
        setFormErrors({ general: err.message || 'Error al guardar categoría' })
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
          Nueva Categoría
        </button>
      </div>

      {error && <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground">Nombre</th>
              <th className="text-left p-3 font-medium text-muted-foreground">Descripción</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Estado</th>
              <th className="text-center p-3 font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map(c => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="p-3 font-medium text-foreground">{c.nombre}</td>
                <td className="p-3 text-muted-foreground">{c.descripcion || '-'}</td>
                <td className="p-3 text-center">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    c.activo ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}>
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-3 text-center space-x-2">
                  <button onClick={() => openEdit(c.id)} className="px-3 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium hover:bg-primary/20 transition-colors">
                    Editar
                  </button>
                  {c.activo && (
                    <button onClick={() => handleDelete(c.id)} className="px-3 py-1 bg-destructive/10 text-destructive rounded-md text-xs font-medium hover:bg-destructive/20 transition-colors">
                      Desactivar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {categories?.length === 0 && (
              <tr><td colSpan={4} className="p-6 text-center text-muted-foreground">No hay categorías registradas.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={modal} onClose={() => setModal(false)} title={editingId ? 'Editar Categoría' : 'Nueva Categoría'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formErrors.general && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{formErrors.general}</div>}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre <span className="text-destructive">*</span></label>
            <input type="text" value={form.nombre} onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            {formErrors.nombre && <p className="text-xs text-destructive mt-1">{formErrors.nombre}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descripción</label>
            <textarea value={form.descripcion} onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))} rows={3}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-sm font-medium text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving} className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50">
              {saving ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
