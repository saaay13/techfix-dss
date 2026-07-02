import api from './api'

export const getServiceTypes = () => api.get('/service-types').then(r => r.data)
export const getServiceType = (id: number) => api.get(`/service-types/${id}`).then(r => r.data)
export const createServiceType = (data: Record<string, unknown>) => api.post('/service-types', data).then(r => r.data)
export const updateServiceType = (id: number, data: Record<string, unknown>) => api.put(`/service-types/${id}`, data).then(r => r.data)
export const deleteServiceType = (id: number) => api.delete(`/service-types/${id}`).then(r => r.data)
