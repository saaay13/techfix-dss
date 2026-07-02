import api from './api'

export const getCategories = () => api.get('/categories').then(r => r.data)
export const getCategory = (id: number) => api.get(`/categories/${id}`).then(r => r.data)
export const createCategory = (data: Record<string, unknown>) => api.post('/categories', data).then(r => r.data)
export const updateCategory = (id: number, data: Record<string, unknown>) => api.put(`/categories/${id}`, data).then(r => r.data)
export const deleteCategory = (id: number) => api.delete(`/categories/${id}`).then(r => r.data)
