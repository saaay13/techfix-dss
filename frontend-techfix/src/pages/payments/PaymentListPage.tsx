import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { getPayments, getOrderPayments } from '../../services/payments'

interface Payment {
  id: number
  monto: string
  metodo_pago: string
  fecha: string
  service_order_id: number
  serviceOrder: {
    id: number
    costo_total: number
    estado: string
    client: { nombre: string; apellido: string }
  }
}

export default function PaymentListPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const orderId = searchParams.get('orderId')

  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orderSummary, setOrderSummary] = useState<{
    total_pagado: number
    saldo_restante: number
    costo_total: number
  } | null>(null)

  useEffect(() => {
    setLoading(true)
    setError('')

    if (orderId) {
      getOrderPayments(Number(orderId))
        .then(data => {
          setPayments(data.payments || [])
          setOrderSummary({
            total_pagado: data.total_pagado,
            saldo_restante: data.saldo_restante,
            costo_total: data.costo_total,
          })
        })
        .catch(() => setError('Error al cargar pagos de la orden'))
        .finally(() => setLoading(false))
    } else {
      getPayments()
        .then(data => setPayments(data || []))
        .catch(() => setError('Error al cargar pagos'))
        .finally(() => setLoading(false))
    }
  }, [orderId])

  const formatMoney = (value: number) =>
    value.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Pagos</h2>
          {orderId && (
            <p className="text-sm text-muted-foreground mt-1">Filtrando pagos de orden #{orderId}</p>
          )}
        </div>
        <div className="flex gap-2">
          {orderId ? (
            <button onClick={() => navigate(`/pagos/nuevo/${orderId}`)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              + Nuevo Pago
            </button>
          ) : (
            <button onClick={() => navigate('/pagos/nuevo')} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              + Nuevo Pago
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg text-sm">{error}</div>
      )}

      {orderSummary && (
        <div className="mb-6 p-4 bg-card border border-border rounded-xl shadow-sm grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Costo Total:</span>
            <span className="ml-2 font-medium text-foreground">Bs. {formatMoney(orderSummary.costo_total)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Pagado:</span>
            <span className="ml-2 font-medium text-success">Bs. {formatMoney(orderSummary.total_pagado)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Saldo Restante:</span>
            <span className={`ml-2 font-medium ${orderSummary.saldo_restante > 0 ? 'text-destructive' : 'text-success'}`}>
              Bs. {formatMoney(orderSummary.saldo_restante)}
            </span>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-muted-foreground">Cargando pagos...</p>
      ) : payments.length === 0 ? (
        <p className="text-muted-foreground">No hay pagos registrados</p>
      ) : (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-foreground">#</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Orden</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Cliente</th>
                <th className="text-right px-4 py-3 font-medium text-foreground">Monto</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Método</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Fecha</th>
                {!orderId && <th className="text-right px-4 py-3 font-medium text-foreground">Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-foreground font-mono">{p.id}</td>
                  <td className="px-4 py-3">
                    <span
                      onClick={() => navigate(`/pagos?orderId=${p.service_order_id}`)}
                      className="text-primary hover:underline cursor-pointer font-mono"
                    >
                      #{p.service_order_id}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-foreground">
                    {p.serviceOrder?.client?.nombre} {p.serviceOrder?.client?.apellido}
                  </td>
                  <td className="px-4 py-3 text-right text-foreground font-medium">
                    Bs. {formatMoney(Number(p.monto))}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.metodo_pago}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.fecha}</td>
                  {!orderId && (
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => navigate(`/pagos/nuevo/${p.service_order_id}`)}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors"
                      >
                        + Pago
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
