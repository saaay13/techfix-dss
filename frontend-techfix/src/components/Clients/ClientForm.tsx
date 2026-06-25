import { useState } from 'react'
import { createClient } from '../../services/api'

function ClientForm() {
  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    ci: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({})
    setSuccess('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setSuccess('')

    try {
      const client = await createClient(form)
      setSuccess(`Cliente "${client.nombre} ${client.apellido}" registrado correctamente`)
      setForm({ nombre: '', apellido: '', telefono: '', correo: '', ci: '' })
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setErrors(fieldErrors)
      } else if (err.message) {
        setErrors({ general: err.message })
      } else {
        setErrors({ general: 'Error al registrar cliente' })
      }
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text' },
    { name: 'apellido', label: 'Apellido', type: 'text' },
    { name: 'telefono', label: 'Teléfono', type: 'tel' },
    { name: 'correo', label: 'Correo electrónico', type: 'email' },
    { name: 'ci', label: 'CI', type: 'text' },
  ]

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-card border border-border rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-foreground mb-6">Registrar Cliente</h2>

      {success && (
        <div className="mb-4 p-3 bg-success/10 border border-success/30 text-success rounded-lg text-sm">
          {success}
        </div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-error/10 border border-error/30 text-error rounded-lg text-sm">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-foreground mb-1">
              {f.label}
            </label>
            <input
              type={f.type}
              name={f.name}
              value={(form as any)[f.name]}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                errors[f.name] ? 'border-error' : 'border-input'
              }`}
            />
            {errors[f.name] && (
              <p className="mt-1 text-xs text-error">{errors[f.name]}</p>
            )}
          </div>
        ))}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            type="button"
            onClick={() => setForm({ nombre: '', apellido: '', telefono: '', correo: '', ci: '' })}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-neutral-300 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClientForm
