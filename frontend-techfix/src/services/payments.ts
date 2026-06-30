import api from './api'

export const getPayments = () => api.get('/payments').then(r => r.data)
export const getPayment = (id: number) => api.get(`/payments/${id}`).then(r => r.data)
export const createPayment = (data: Record<string, unknown>) => api.post('/payments', data).then(r => r.data)
export const getOrderPayments = (orderId: number) => api.get(`/service-orders/${orderId}/payments`).then(r => r.data)
