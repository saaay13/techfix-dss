import { FormEvent, useEffect, useState } from 'react'
import { createDevice, getDeviceTypes, getPhysicalStates, getClients } from '../services/api'

interface Client {
  id: number
  nombre: string
  apellido: string
}

export default function DeviceForm() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const deviceTypes = getDeviceTypes()
  const physicalStates = getPhysicalStates()

  useEffect(() => {
    getClients()
      .then(data => setClients(data))
      .catch(() => {})
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setErrors({})

    const form = new FormData(e.currentTarget)
    const data: Record<string, unknown> = {
      tipo_equipo: form.get('tipo_equipo'),
      marca: form.get('marca'),
      modelo: form.get('modelo'),
      numero_serie: form.get('numero_serie'),
      estado_fisico: form.get('estado_fisico') || null,
      client_id: Number(form.get('client_id')),
    }

    createDevice(data)
      .then(res => {
        setSuccess(res.message)
        e.currentTarget.reset()
      })
      .catch(err => {
        if (err.errors) setErrors(err.errors)
        else setErrors({ general: [err.message || 'Error al registrar'] })
      })
      .finally(() => setLoading(false))
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h1>Registrar Equipo</h1>

      {success && <div style={{ background: '#d4edda', padding: 12, borderRadius: 4, marginBottom: 16 }}>{success}</div>}
      {errors.general && <div style={{ background: '#f8d7da', padding: 12, borderRadius: 4, marginBottom: 16 }}>{errors.general[0]}</div>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label><strong>Cliente *</strong></label>
          <select name="client_id" required style={{ width: '100%', padding: 8 }}>
            <option value="">Seleccionar cliente</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} {c.apellido}</option>
            ))}
          </select>
          {errors.client_id && <small style={{ color: 'red' }}>{errors.client_id[0]}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label><strong>Tipo de Equipo *</strong></label>
          <select name="tipo_equipo" required style={{ width: '100%', padding: 8 }}>
            <option value="">Seleccionar tipo</option>
            {deviceTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          {errors.tipo_equipo && <small style={{ color: 'red' }}>{errors.tipo_equipo[0]}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label><strong>Marca *</strong></label>
          <input name="marca" required style={{ width: '100%', padding: 8 }} />
          {errors.marca && <small style={{ color: 'red' }}>{errors.marca[0]}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label><strong>Modelo *</strong></label>
          <input name="modelo" required style={{ width: '100%', padding: 8 }} />
          {errors.modelo && <small style={{ color: 'red' }}>{errors.modelo[0]}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label><strong>Número de Serie *</strong></label>
          <input name="numero_serie" required style={{ width: '100%', padding: 8 }} />
          {errors.numero_serie && <small style={{ color: 'red' }}>{errors.numero_serie[0]}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label><strong>Estado Físico</strong> <span title="Bueno: funciona correctamente, Regular: tiene detalles estéticos/funcionales menores, Malo: no funciona o está dañado">ⓘ</span></label>
          <select name="estado_fisico" style={{ width: '100%', padding: 8 }}>
            <option value="">Sin especificar</option>
            {physicalStates.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={loading} style={{ padding: '10px 24px', background: '#0d6efd', color: '#fff', border: 'none', borderRadius: 4 }}>
            {loading ? 'Guardando...' : 'Registrar Equipo'}
          </button>
          <button type="button" onClick={() => window.history.back()} style={{ padding: '10px 24px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 4 }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
