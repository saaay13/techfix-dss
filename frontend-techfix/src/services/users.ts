import api from './api'

export const getUsers = () => api.get('/users').then(r => r.data)
export const getUser = (id: number) => api.get(`/users/${id}`).then(r => r.data)
export const createUser = (data: Record<string, unknown>) => api.post('/users', data).then(r => r.data)
export const updateUser = (id: number, data: Record<string, unknown>) => api.put(`/users/${id}`, data).then(r => r.data)
export const deleteUser = (id: number) => api.delete(`/users/${id}`).then(r => r.data)

export const getRoles = () => api.get('/roles').then(r => r.data)
