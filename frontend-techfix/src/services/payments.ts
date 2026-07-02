import api from './api'

export const getPayments = (params?: { orderId?: number }) => {
  const query = params?.orderId ? `?orderId=${params.orderId}` : ''
  return api.get(`/payments${query}`).then(r => r.data)
}

export const getPayment = (id: number) =>
  api.get(`/payments/${id}`).then(r => r.data)

export const createPayment = (data: {
  monto: number
  metodo_pago: string
  fecha: string
  service_order_id: number
}) =>
  api.post('/payments', data).then(r => r.data)

export const getOrderPayments = (orderId: number) =>
  api.get(`/service-orders/${orderId}/payments`).then(r => r.data)
