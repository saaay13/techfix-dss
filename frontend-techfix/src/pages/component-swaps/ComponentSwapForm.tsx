import { useState, useEffect } from 'react'
import { getServiceOrders } from '../../services/orders'
import { getComponents } from '../../services/components'
import { createComponentSwap } from '../../services/componentSwaps'

export default function ComponentSwapForm() {
  const [orders, setOrders] = useState<any[]>([])
  const [components, setComponents] = useState<any[]>([])

  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [devueltoAlCliente, setDevueltoAlCliente] = useState(false)
  const [retiradoComponentId, setRetiradoComponentId] = useState('')
  const [retiradoCantidad, setRetiradoCantidad] = useState('1')
  const [instaladoComponentId, setInstaladoComponentId] = useState('')
  const [instaladoCantidad, setInstaladoCantidad] = useState('1')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getServiceOrders().then(setOrders)
    getComponents().then(setComponents)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setLoading(true)

    try {
      const data = await createComponentSwap({
        service_order_id: Number(selectedOrderId),
        observaciones: observaciones || null,
        devuelto_al_cliente: devueltoAlCliente,
        retirado_component_id: Number(retiradoComponentId),
        retirado_cantidad: Number(retiradoCantidad),
        instalado_component_id: Number(instaladoComponentId),
        instalado_cantidad: Number(instaladoCantidad),
      })
      setSuccess(`Cambio #${data.component_swap.id} registrado exitosamente.`)
      setSelectedOrderId('')
      setObservaciones('')
      setDevueltoAlCliente(false)
      setRetiradoComponentId('')
      setRetiradoCantidad('1')
      setInstaladoComponentId('')
      setInstaladoCantidad('1')
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setErrors(fieldErrors)
      } else {
        setErrors({ general: err.message || 'Error al registrar el cambio.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Registrar Cambio de Componente</h2>

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
          <label>Orden de Servicio <span style={{ color: 'red' }}>*</span></label>
          <select value={selectedOrderId} onChange={e => setSelectedOrderId(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}>
            <option value="">-- Seleccione una orden --</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>#{o.id} - {o.client?.nombre} {o.client?.apellido}</option>
            ))}
          </select>
          {errors.service_order_id && <small style={{ color: 'red' }}>{errors.service_order_id}</small>}
        </div>

        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', fontSize: 14 }}>Componente Retirado</legend>

          <div style={{ marginBottom: 12 }}>
            <label>Componente <span style={{ color: 'red' }}>*</span></label>
            <select value={retiradoComponentId} onChange={e => setRetiradoComponentId(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}>
              <option value="">-- Seleccione --</option>
              {components.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} (Stock: {c.cantidad})</option>
              ))}
            </select>
            {errors.retirado_component_id && <small style={{ color: 'red' }}>{errors.retirado_component_id}</small>}
          </div>

          <div>
            <label>Cantidad <span style={{ color: 'red' }}>*</span></label>
            <input type="number" min="1" value={retiradoCantidad} onChange={e => setRetiradoCantidad(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
            {errors.retirado_cantidad && <small style={{ color: 'red' }}>{errors.retirado_cantidad}</small>}
          </div>
        </fieldset>

        <fieldset style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16, marginBottom: 16 }}>
          <legend style={{ fontWeight: 'bold', fontSize: 14 }}>Componente Instalado</legend>

          <div style={{ marginBottom: 12 }}>
            <label>Componente <span style={{ color: 'red' }}>*</span></label>
            <select value={instaladoComponentId} onChange={e => setInstaladoComponentId(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}>
              <option value="">-- Seleccione --</option>
              {components.map(c => (
                <option key={c.id} value={c.id}>{c.nombre} (Stock: {c.cantidad})</option>
              ))}
            </select>
            {errors.instalado_component_id && <small style={{ color: 'red' }}>{errors.instalado_component_id}</small>}
          </div>

          <div>
            <label>Cantidad <span style={{ color: 'red' }}>*</span></label>
            <input type="number" min="1" value={instaladoCantidad} onChange={e => setInstaladoCantidad(e.target.value)}
              style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
            {errors.instalado_cantidad && <small style={{ color: 'red' }}>{errors.instalado_cantidad}</small>}
          </div>
        </fieldset>

        <div style={{ marginBottom: 16 }}>
          <label>Observaciones</label>
          <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} rows={2}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }} />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input type="checkbox" checked={devueltoAlCliente} onChange={e => setDevueltoAlCliente(e.target.checked)} />
            El componente retirado fue devuelto al cliente
          </label>
        </div>

        <button type="submit" disabled={loading}
          style={{
            padding: '10px 24px', background: '#007bff', color: 'white', border: 'none',
            borderRadius: 6, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
          }}>
          {loading ? 'Registrando...' : 'Registrar Cambio'}
        </button>
      </form>
    </div>
  )
}
