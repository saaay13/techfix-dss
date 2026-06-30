import { useState, useEffect } from 'react'
import { getPayments, createPayment } from '../services/payments'
import { getServiceOrders } from '../services/orders'

const METODOS = ['Efectivo', 'Transferencia', 'Tarjeta', 'QR']

export default function PaymentForm() {
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [monto, setMonto] = useState('')
  const [metodoPago, setMetodoPago] = useState('Efectivo')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getServiceOrders().then(setOrders)
  }, [])

  useEffect(() => {
    if (selectedOrderId) {
      const order = orders.find(o => o.id === Number(selectedOrderId))
      setSelectedOrder(order || null)
      if (order) {
        getPayments().then(payments => {
          const orderPayments = payments.filter((p: any) => p.service_order_id === order.id)
          const totalPagado = orderPayments.reduce((sum: number, p: any) => sum + Number(p.monto), 0)
          setSelectedOrder({
            ...order,
            payments: orderPayments,
            total_pagado: totalPagado,
            saldo_restante: Number(order.costo_total) - totalPagado,
          })
        })
      }
    } else {
      setSelectedOrder(null)
    }
  }, [selectedOrderId, orders])

  const formatMoney = (value: number) =>
    value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')
    setLoading(true)

    try {
      const data = await createPayment({
        service_order_id: Number(selectedOrderId),
        monto: Number(monto),
        metodo_pago: metodoPago,
      })
      setSuccess(`Pago de Bs. ${formatMoney(Number(monto))} registrado exitosamente.`)
      setMonto('')

      if (selectedOrder) {
        setSelectedOrder({
          ...selectedOrder,
          total_pagado: data.total_pagado,
          saldo_restante: data.saldo_restante,
          payments: [...(selectedOrder.payments || []), data.payment],
        })
      }
    } catch (err: any) {
      if (err.errors) {
        const fieldErrors: Record<string, string> = {}
        for (const [key, msgs] of Object.entries(err.errors)) {
          fieldErrors[key] = (msgs as string[])[0]
        }
        setErrors(fieldErrors)
      } else {
        setErrors({ general: err.message || 'Error al registrar el pago.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2 style={{ marginBottom: 24 }}>Registrar Pago</h2>

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
          <select
            value={selectedOrderId}
            onChange={e => setSelectedOrderId(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            <option value="">-- Seleccione una orden --</option>
            {orders.map(o => (
              <option key={o.id} value={o.id}>
                #{o.id} - {o.client?.nombre} {o.client?.apellido} - {o.estado}
              </option>
            ))}
          </select>
          {errors.service_order_id && <small style={{ color: 'red' }}>{errors.service_order_id}</small>}
        </div>

        {selectedOrder && (
          <div style={{
            background: '#f0f4f8',
            padding: 16,
            borderRadius: 8,
            marginBottom: 16,
          }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 14, color: '#555' }}>Resumen de Orden #{selectedOrder.id}</h4>
            <div style={{ fontSize: 13, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              <span>Cliente: <strong>{selectedOrder.client?.nombre} {selectedOrder.client?.apellido}</strong></span>
              <span>Estado: <strong>{selectedOrder.estado}</strong></span>
              <span>Prioridad: <strong>{selectedOrder.prioridad}</strong></span>
              <span>Costo Total: <strong>Bs. {formatMoney(Number(selectedOrder.costo_total))}</strong></span>
              <span style={{ color: '#28a745' }}>Total Pagado: <strong>Bs. {formatMoney(selectedOrder.total_pagado || 0)}</strong></span>
              <span style={{ color: selectedOrder.saldo_restante > 0 ? '#dc3545' : '#28a745' }}>
                Saldo Restante: <strong>Bs. {formatMoney(selectedOrder.saldo_restante)}</strong>
              </span>
            </div>

            {selectedOrder.payments && selectedOrder.payments.length > 0 && (
              <div style={{ marginTop: 12 }}>
                <h5 style={{ margin: '0 0 4px', fontSize: 12, color: '#888' }}>Historial de Pagos</h5>
                <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#e9ecef' }}>
                      <th style={{ padding: '4px 8px', textAlign: 'left' }}>Fecha</th>
                      <th style={{ padding: '4px 8px', textAlign: 'left' }}>Método</th>
                      <th style={{ padding: '4px 8px', textAlign: 'right' }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.payments.map((p: any) => (
                      <tr key={p.id}>
                        <td style={{ padding: '4px 8px' }}>{p.fecha}</td>
                        <td style={{ padding: '4px 8px' }}>{p.metodo_pago}</td>
                        <td style={{ padding: '4px 8px', textAlign: 'right' }}>Bs. {formatMoney(Number(p.monto))}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label>Monto (Bs.) <span style={{ color: 'red' }}>*</span></label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={monto}
            onChange={e => setMonto(e.target.value)}
            placeholder="0.00"
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          />
          {errors.monto && <small style={{ color: 'red' }}>{errors.monto}</small>}
        </div>

        <div style={{ marginBottom: 24 }}>
          <label>Método de Pago <span style={{ color: 'red' }}>*</span></label>
          <select
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value)}
            style={{ display: 'block', width: '100%', padding: 8, marginTop: 4 }}
          >
            {METODOS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.metodo_pago && <small style={{ color: 'red' }}>{errors.metodo_pago}</small>}
        </div>

        {selectedOrder && selectedOrder.saldo_restante <= 0 && (
          <div style={{
            background: '#fff3cd',
            color: '#856404',
            padding: 12,
            borderRadius: 6,
            marginBottom: 16,
            fontSize: 14,
          }}>
            Esta orden ya está totalmente pagada.
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (selectedOrder?.saldo_restante <= 0)}
          style={{
            padding: '10px 24px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            cursor: (loading || (selectedOrder?.saldo_restante <= 0)) ? 'not-allowed' : 'pointer',
            opacity: (loading || (selectedOrder?.saldo_restante <= 0)) ? 0.7 : 1,
          }}
        >
          {loading ? 'Registrando...' : 'Registrar Pago'}
        </button>
      </form>
    </div>
  )
}
