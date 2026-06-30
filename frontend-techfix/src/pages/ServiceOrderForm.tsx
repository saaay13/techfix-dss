import { useState, useEffect } from 'react'
import { getClients, getClientDevices, getServiceTypes, createServiceOrder } from '../services/api'

const PRIORIDADES = ['Baja', 'Media', 'Alta']
const COLORES: Record<string, string> = {
  Baja: '#28a745',
  Media: '#ffc107',
  Alta: '#dc3545',
}

export default function ServiceOrderForm() {
  const [clients, setClients] = useState<any[]>([])
  const [devices, setDevices] = useState<any[]>([])
  const [serviceTypes, setServiceTypes] = useState<any[]>([])
  const [selectedClientId, setSelectedClientId] = useState('')
  const [selectedDeviceId, setSelectedDeviceId] = useState('')
  const [diagnostico, setDiagnostico] = useState('')
  const [prioridad, setPrioridad] = useState('Media')
  const [servicioId, setServicioId] = useState('')
  const [fechaEntrega, setFechaEntrega] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getClients().then(setClients)
    getServiceTypes().then(setServiceTypes)
  }, [])

  useEffect(() => {
    if (selectedClientId) {
      getClientDevices(Number(selectedClientId)).then(setDevices)
      setSelectedDeviceId('')
    } else {
      setDevices([])
    }
  }, [selectedClientId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setLoading(true)

    try {
      const data = await createServiceOrder({
        client_id: Number(selectedClientId),
        device_id: Number(selectedDeviceId),
        service_type_id: Number(servicioId),
        diagnostico_inicial: diagnostico,
        prioridad,
        fecha_estimada_entrega: fechaEntrega || null,
        observaciones: observaciones || null,
      })
      setSuccess(`Orden #${data.service_order.id} creada exitosamente.`)
      setSelectedClientId('')
      setSelectedDeviceId('')
      setDiagnostico('')
      setPrioridad('Media')
      setServicioId('')
      setFechaEntrega('')
      setObservaciones('')
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setErrors(fieldErrors)
      } else {
        setErrors({ general: err.message || 'Error al crear la orden.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>Nueva Orden de Servicio</h2>

      {success && (
        <div style={{ background: '#d4edda', color: '#155724', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          {success}
        </div>
      )}

      {errors.general && (
        <div style={{ background: '#f8d7da', color: '#721c24', padding: 12, borderRadius: 6, marginBottom: 16 }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Cliente <span style={{ color: 'red' }}>*</span></label>
          <select
            value={selectedClientId}
            onChange={e => setSelectedClientId(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">-- Seleccione un cliente --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.nombre} {c.apellido} - {c.ci}</option>
            ))}
          </select>
          {errors.client_id && <small style={{ color: 'red' }}>{errors.client_id}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Equipo <span style={{ color: 'red' }}>*</span></label>
          <select
            value={selectedDeviceId}
            onChange={e => setSelectedDeviceId(e.target.value)}
            disabled={!selectedClientId}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">-- Seleccione un equipo --</option>
            {devices.map(d => (
              <option key={d.id} value={d.id}>
                {d.tipo_equipo} - {d.marca} {d.modelo} ({d.numero_serie})
              </option>
            ))}
          </select>
          {errors.device_id && <small style={{ color: 'red' }}>{errors.device_id}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Tipo de Servicio <span style={{ color: 'red' }}>*</span></label>
          <select
            value={servicioId}
            onChange={e => setServicioId(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">-- Seleccione tipo de servicio --</option>
            {serviceTypes.map(st => (
              <option key={st.id} value={st.id}>{st.nombre}</option>
            ))}
          </select>
          {errors.service_type_id && <small style={{ color: 'red' }}>{errors.service_type_id}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Diagnóstico Inicial <span style={{ color: 'red' }}>*</span></label>
          <textarea
            value={diagnostico}
            onChange={e => setDiagnostico(e.target.value)}
            rows={4}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
          {errors.diagnostico_inicial && <small style={{ color: 'red' }}>{errors.diagnostico_inicial}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Prioridad <span style={{ color: 'red' }}>*</span></label>
          <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
            {PRIORIDADES.map(p => (
              <label key={p} style={{
                padding: '8px 16px',
                border: `2px solid ${prioridad === p ? COLORES[p] : '#ccc'}`,
                borderRadius: 6,
                cursor: 'pointer',
                background: prioridad === p ? COLORES[p] : 'white',
                color: prioridad === p ? 'white' : '#333',
                fontWeight: prioridad === p ? 'bold' : 'normal',
              }}>
                <input
                  type="radio"
                  name="prioridad"
                  value={p}
                  checked={prioridad === p}
                  onChange={e => setPrioridad(e.target.value)}
                  style={{ display: 'none' }}
                />
                {p}
              </label>
            ))}
          </div>
          {errors.prioridad && <small style={{ color: 'red' }}>{errors.prioridad}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Fecha Estimada de Entrega</label>
          <input
            type="date"
            value={fechaEntrega}
            onChange={e => setFechaEntrega(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
          {errors.fecha_estimada_entrega && <small style={{ color: 'red' }}>{errors.fecha_estimada_entrega}</small>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label>Observaciones</label>
          <textarea
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
            rows={2}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '10px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Creando...' : 'Crear Orden de Servicio'}
        </button>
      </form>
    </div>
  )
}
