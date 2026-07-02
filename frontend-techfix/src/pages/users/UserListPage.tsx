import { useEffect, useState } from 'react'
import { getUsers, createUser, updateUser, getUser, deleteUser, getRoles } from '../../services/users'
import Modal from '../../components/Modal'

interface User {
  id: number
  name: string
  apellido: string
  email: string
  telefono: string
  activo: boolean
  role_id: number
  role: { id: number; nombre: string }
}

interface Role {
  id: number
  nombre: string
}

const emptyForm = { name: '', apellido: '', email: '', password: '', telefono: '', role_id: '', activo: true }

export default function UserListPage() {
  const [users, setUsers] = useState<User[] | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [error, setError] = useState('')
  const [modal, setModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const fetchUsers = async () => {
    try {
      const data = await getUsers()
      setUsers(data)
    } catch {
      setError('Error al cargar usuarios')
    }
  }

  useEffect(() => {
    fetchUsers()
    getRoles().then(setRoles).catch(() => {})
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormErrors({})
    setModal(true)
  }

  const openEdit = async (id: number) => {
    try {
      const user = await getUser(id)
      setEditingId(id)
      setForm({
        name: user.name,
        apellido: user.apellido,
        email: user.email,
        password: '',
        telefono: user.telefono || '',
        role_id: String(user.role_id),
        activo: user.activo,
      })
      setFormErrors({})
      setModal(true)
    } catch {
      setError('Error al cargar usuario')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    setFormErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormErrors({})
    const payload: Record<string, unknown> = {
      name: form.name, apellido: form.apellido, email: form.email,
      telefono: form.telefono, role_id: Number(form.role_id), activo: form.activo,
    }
    if (form.password) payload.password = form.password
    try {
      if (editingId) {
        await updateUser(editingId, payload)
      } else {
        payload.password = form.password || '12345678'
        await createUser(payload)
      }
      setModal(false)
      fetchUsers()
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setFormErrors(fieldErrors)
      } else {
        setFormErrors({ general: 'Error al guardar usuario' })
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`¿Desactivar al usuario "${name}"?`)) return
    try {
      await deleteUser(id)
      fetchUsers()
    } catch {
      setError('Error al desactivar usuario')
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Gestión de Usuarios</h2>
        <button onClick={openNew} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
          + Nuevo Usuario
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{error}</div>
      )}

      {users === null ? null : users.length === 0 ? (
        <p className="text-muted-foreground">No hay usuarios registrados</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">Nombre</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Email</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Teléfono</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Rol</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Estado</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground">{user.name} {user.apellido}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.telefono || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary-600 rounded-full text-xs font-medium">{user.role?.nombre}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.activo ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                    }`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap">
                      <button onClick={() => openEdit(user.id)} className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors group" title="Editar">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {user.activo && (
                        <button onClick={() => handleDelete(user.id, `${user.name} ${user.apellido}`)} className="p-1.5 hover:bg-error/10 rounded-lg transition-colors group" title="Desactivar">
                          <svg className="w-4 h-4 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editingId ? 'Editar Usuario' : 'Nuevo Usuario'}>
        {formErrors.general && (
          <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{formErrors.general}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.name ? 'border-error' : 'border-input'}`} />
            {formErrors.name && <p className="mt-1 text-xs text-error">{formErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Apellido</label>
            <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.apellido ? 'border-error' : 'border-input'}`} />
            {formErrors.apellido && <p className="mt-1 text-xs text-error">{formErrors.apellido}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Correo electrónico</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.email ? 'border-error' : 'border-input'}`} />
            {formErrors.email && <p className="mt-1 text-xs text-error">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">{editingId ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.password ? 'border-error' : 'border-input'}`} />
            {formErrors.password && <p className="mt-1 text-xs text-error">{formErrors.password}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
            <input type="text" name="telefono" value={form.telefono} onChange={handleChange}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
            <select name="role_id" value={form.role_id} onChange={handleChange} required
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${formErrors.role_id ? 'border-error' : 'border-input'}`}>
              <option value="">Seleccionar rol</option>
              {roles.map(r => <option key={r.id} value={r.id}>{r.nombre}</option>)}
            </select>
            {formErrors.role_id && <p className="mt-1 text-xs text-error">{formErrors.role_id}</p>}
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
