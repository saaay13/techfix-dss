import api from './api'

export const getCategories = () => api.get('/categories').then(r => r.data)
export const getComponents = () => api.get('/components').then(r => r.data)
export const getComponent = (id: number) => api.get(`/components/${id}`).then(r => r.data)
export const createComponent = (data: Record<string, unknown>) => api.post('/components', data).then(r => r.data)
export const updateComponent = (id: number, data: Record<string, unknown>) => api.put(`/components/${id}`, data).then(r => r.data)
export const deleteComponent = (id: number) => api.delete(`/components/${id}`).then(r => r.data)
