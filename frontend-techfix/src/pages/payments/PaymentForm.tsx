import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getPayments, createPayment } from '../../services/payments'
import { getServiceOrders } from '../../services/orders'

const METODOS = ['Efectivo', 'Transferencia', 'Tarjeta', 'QR']

export default function PaymentForm() {
  const { orderId } = useParams()
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState(orderId || '')
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

  const formatMoney = (value: number | null | undefined) =>
    (value ?? 0).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">Registrar Pago</h2>
        <p className="text-sm text-muted-foreground mt-1">Asocia un pago a una orden de servicio</p>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-success/10 border border-success/30 text-success rounded-lg text-sm">{success}</div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 space-y-4">
          {orderId ? (
            <div className="p-3 bg-muted/30 rounded-lg text-sm">
              <span className="text-muted-foreground">Orden de Servicio: </span>
              <span className="font-medium text-foreground">#{selectedOrderId}</span>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Orden de Servicio <span className="text-destructive">*</span></label>
              <select
                value={selectedOrderId}
                onChange={e => setSelectedOrderId(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- Seleccione una orden --</option>
                {orders.map(o => (
                  <option key={o.id} value={o.id}>
                    #{o.id} - {o.client?.nombre} {o.client?.apellido} - {o.estado}
                  </option>
                ))}
              </select>
              {errors.service_order_id && <p className="mt-1 text-xs text-destructive">{errors.service_order_id}</p>}
            </div>
          )}

          {selectedOrder && (
            <div className="p-4 bg-muted/30 rounded-lg space-y-2">
              <h4 className="text-sm font-semibold text-foreground">Resumen de Orden #{selectedOrder.id}</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Cliente: <span className="font-medium text-foreground">{selectedOrder.client?.nombre} {selectedOrder.client?.apellido}</span></span>
                <span className="text-muted-foreground">Estado: <span className="font-medium text-foreground">{selectedOrder.estado}</span></span>
                <span className="text-muted-foreground">Prioridad: <span className="font-medium text-foreground">{selectedOrder.prioridad}</span></span>
                <span className="text-muted-foreground">Costo Total: <span className="font-medium text-foreground">Bs. {formatMoney(Number(selectedOrder.costo_total))}</span></span>
                <span className="text-success font-medium">Total Pagado: Bs. {formatMoney(selectedOrder.total_pagado || 0)}</span>
                <span className={selectedOrder.saldo_restante > 0 ? 'text-destructive font-medium' : 'text-success font-medium'}>
                  Saldo Restante: Bs. {formatMoney(selectedOrder.saldo_restante)}
                </span>
              </div>

              {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                <div className="mt-2">
                  <h5 className="text-xs font-medium text-muted-foreground mb-1">Historial de Pagos</h5>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-1 pr-2 text-muted-foreground font-medium">Fecha</th>
                        <th className="text-left py-1 px-2 text-muted-foreground font-medium">Método</th>
                        <th className="text-right py-1 pl-2 text-muted-foreground font-medium">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.payments.map((p: any) => (
                        <tr key={p.id} className="border-b border-border/50">
                          <td className="py-1 pr-2 text-foreground">{p.fecha}</td>
                          <td className="py-1 px-2 text-foreground">{p.metodo_pago}</td>
                          <td className="py-1 pl-2 text-right text-foreground">Bs. {formatMoney(Number(p.monto))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Monto (Bs.) <span className="text-destructive">*</span></label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {errors.monto && <p className="mt-1 text-xs text-destructive">{errors.monto}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Método de Pago <span className="text-destructive">*</span></label>
            <select
              value={metodoPago}
              onChange={e => setMetodoPago(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {METODOS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.metodo_pago && <p className="mt-1 text-xs text-destructive">{errors.metodo_pago}</p>}
          </div>

          {selectedOrder && selectedOrder.saldo_restante <= 0 && (
            <div className="p-3 bg-warning/10 border border-warning/30 text-warning rounded-lg text-sm">
              Esta orden ya está totalmente pagada.
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || (selectedOrder?.saldo_restante <= 0)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Registrando...' : 'Registrar Pago'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
