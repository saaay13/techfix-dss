import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createUser, updateUser, getUser, getRoles } from '../services/api'

interface Role {
  id: number
  nombre: string
}

export default function UserFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [form, setForm] = useState({
    name: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    role_id: '',
    activo: true,
  })
  const [roles, setRoles] = useState<Role[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getRoles().then(setRoles).catch(() => {})
    if (isEdit) {
      getUser(Number(id)).then(user => {
        setForm({
          name: user.name,
          apellido: user.apellido,
          email: user.email,
          password: '',
          telefono: user.telefono || '',
          role_id: String(user.role_id),
          activo: user.activo,
        })
      }).catch(() => navigate('/usuarios'))
    }
  }, [id, isEdit, navigate])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const payload: Record<string, unknown> = {
      name: form.name,
      apellido: form.apellido,
      email: form.email,
      telefono: form.telefono,
      role_id: Number(form.role_id),
      activo: form.activo,
    }
    if (form.password) {
      payload.password = form.password
    }

    try {
      if (isEdit) {
        await updateUser(Number(id), payload)
      } else {
        await createUser(payload)
      }
      navigate('/usuarios')
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.response.data.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setErrors(fieldErrors)
      } else {
        setErrors({ general: 'Error al guardar usuario' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-6">
        {isEdit ? 'Editar Usuario' : 'Nuevo Usuario'}
      </h2>

      {errors.general && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-error' : 'border-input'}`} />
          {errors.name && <p className="mt-1 text-xs text-error">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Apellido</label>
          <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.apellido ? 'border-error' : 'border-input'}`} />
          {errors.apellido && <p className="mt-1 text-xs text-error">{errors.apellido}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Correo electrónico</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.email ? 'border-error' : 'border-input'}`} />
          {errors.email && <p className="mt-1 text-xs text-error">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {isEdit ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
          </label>
          <input type="password" name="password" value={form.password} onChange={handleChange}
            {...(!isEdit && { required: true })}
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.password ? 'border-error' : 'border-input'}`} />
          {errors.password && <p className="mt-1 text-xs text-error">{errors.password}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Teléfono</label>
          <input type="text" name="telefono" value={form.telefono} onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Rol</label>
          <select name="role_id" value={form.role_id} onChange={handleChange} required
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.role_id ? 'border-error' : 'border-input'}`}>
            <option value="">Seleccionar rol</option>
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.nombre}</option>
            ))}
          </select>
          {errors.role_id && <p className="mt-1 text-xs text-error">{errors.role_id}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange}
            className="h-4 w-4 rounded border-input text-primary focus:ring-primary/50" />
          <label className="text-sm text-foreground">Activo</label>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
          <button type="button" onClick={() => navigate('/usuarios')}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-neutral-300 transition-colors">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
