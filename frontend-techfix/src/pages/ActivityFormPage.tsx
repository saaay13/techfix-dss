import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../services/api'

export default function ActivityFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [nombre, setNombre] = useState('')
  const [activo, setActivo] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      api.get(`/activities/${id}`)
        .then(({ data }) => {
          setNombre(data.nombre)
          setActivo(data.activo)
        })
        .catch(() => navigate('/actividades'))
    }
  }, [id, isEdit, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isEdit) {
        await api.put(`/activities/${id}`, { nombre, activo })
      } else {
        await api.post('/activities', { nombre })
      }
      navigate('/actividades')
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setErrors(fieldErrors)
      } else {
        setErrors({ general: 'Error al guardar actividad' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">{isEdit ? 'Editar Actividad' : 'Nueva Actividad'}</h2>
        <p className="text-sm text-muted-foreground mt-1">{isEdit ? 'Modifica los datos de la actividad' : 'Registra una nueva actividad'}</p>
      </div>
      <div className="bg-card border border-border rounded-xl shadow-sm p-6">

      {errors.general && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => { setNombre(e.target.value); setErrors({}) }}
            required
            className={`w-full px-3 py-2 border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.nombre ? 'border-destructive' : 'border-input'}`}
          />
          {errors.nombre && <p className="mt-1 text-xs text-destructive">{errors.nombre}</p>}
        </div>

        {isEdit && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activo}
              onChange={(e) => setActivo(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <label className="text-sm text-foreground">Activo</label>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Crear'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/actividades')}
            className="px-4 py-2 bg-muted text-muted-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
      </div>
    </div>
  )
}
