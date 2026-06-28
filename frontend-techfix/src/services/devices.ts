import api from './api'

export const getDevices = (clientId?: number) => api.get(`/devices${clientId ? `?client_id=${clientId}` : ''}`).then(r => r.data)
export const getClientDevices = (clientId: number) => api.get(`/devices?client_id=${clientId}`).then(r => r.data)
export const getDevice = (id: number) => api.get(`/devices/${id}`).then(r => r.data)
export const createDevice = (data: Record<string, unknown>) => api.post('/devices', data).then(r => r.data)
export const updateDevice = (id: number, data: Record<string, unknown>) => api.put(`/devices/${id}`, data).then(r => r.data)
export const deleteDevice = (id: number) => api.delete(`/devices/${id}`).then(r => r.data)

export const getDeviceTypes = () => [
  'PC', 'Laptop', 'PlayStation', 'Xbox', 'Nintendo', 'Celular', 'Electrónica general',
]

export const getPhysicalStates = () => ['Bueno', 'Regular', 'Malo']
