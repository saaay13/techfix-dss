import api from './api'

export const getServiceTypes = () => api.get('/service-types').then(r => r.data)
export const getServiceOrders = () => api.get('/service-orders').then(r => r.data)
export const getServiceOrder = (id: number) => api.get(`/service-orders/${id}`).then(r => r.data)
export const createServiceOrder = (data: Record<string, unknown>) => api.post('/service-orders', data).then(r => r.data)
export const updateServiceOrder = (id: number, data: Record<string, unknown>) => api.put(`/service-orders/${id}`, data).then(r => r.data)
export const deleteServiceOrder = (id: number) => api.delete(`/service-orders/${id}`).then(r => r.data)
export const updateServiceOrderStatus = (id: number, data: { estado_nuevo: string; nota?: string }) =>
  api.put(`/service-orders/${id}/status`, data).then(r => r.data)
