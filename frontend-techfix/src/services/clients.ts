import api from './api'

export const getClients = (search = '') => api.get(`/clients?search=${search}`).then(r => r.data)
export const getClient = (id: number) => api.get(`/clients/${id}`).then(r => r.data)
export const createClient = (data: Record<string, string>) => api.post('/clients', data).then(r => r.data)
export const updateClient = (id: number, data: Record<string, string>) => api.put(`/clients/${id}`, data).then(r => r.data)
export const deleteClient = (id: number) => api.delete(`/clients/${id}`).then(r => r.data)
