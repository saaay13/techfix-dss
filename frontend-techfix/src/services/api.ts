const BASE = 'http://127.0.0.1:8000/api'

async function request(method: string, path: string, data?: unknown) {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = { 'Accept': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  if (data) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  })
  const json = await res.json()
  if (!res.ok) throw json
  return { data: json }
}

const api = {
  get: (path: string) => request('GET', path),
  post: (path: string, data?: unknown) => request('POST', path, data),
  put: (path: string, data?: unknown) => request('PUT', path, data),
  delete: (path: string) => request('DELETE', path),
}

export default api

export const ping = () => api.get('/ping').then(r => r.data)

export const getUsers = () => api.get('/users').then(r => r.data)
export const getUser = (id: number) => api.get(`/users/${id}`).then(r => r.data)
export const createUser = (data: Record<string, unknown>) => api.post('/users', data).then(r => r.data)
export const updateUser = (id: number, data: Record<string, unknown>) => api.put(`/users/${id}`, data).then(r => r.data)
export const deleteUser = (id: number) => api.delete(`/users/${id}`).then(r => r.data)

export const getRoles = () => api.get('/roles').then(r => r.data)

export const getClients = (search = '') => api.get(`/clients?search=${search}`).then(r => r.data)
export const getClient = (id: number) => api.get(`/clients/${id}`).then(r => r.data)
export const createClient = (data: Record<string, string>) => api.post('/clients', data).then(r => r.data)
export const updateClient = (id: number, data: Record<string, string>) => api.put(`/clients/${id}`, data).then(r => r.data)
export const deleteClient = (id: number) => api.delete(`/clients/${id}`).then(r => r.data)

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

export const getServiceTypes = () => api.get('/service-types').then(r => r.data)
export const getServiceOrders = () => api.get('/service-orders').then(r => r.data)
export const getServiceOrder = (id: number) => api.get(`/service-orders/${id}`).then(r => r.data)
export const createServiceOrder = (data: Record<string, unknown>) => api.post('/service-orders', data).then(r => r.data)
export const updateServiceOrder = (id: number, data: Record<string, unknown>) => api.put(`/service-orders/${id}`, data).then(r => r.data)
export const deleteServiceOrder = (id: number) => api.delete(`/service-orders/${id}`).then(r => r.data)

export const getCategories = () => api.get('/categories').then(r => r.data)
export const getComponents = () => api.get('/components').then(r => r.data)
export const getComponent = (id: number) => api.get(`/components/${id}`).then(r => r.data)
export const createComponent = (data: Record<string, unknown>) => api.post('/components', data).then(r => r.data)
export const updateComponent = (id: number, data: Record<string, unknown>) => api.put(`/components/${id}`, data).then(r => r.data)
export const deleteComponent = (id: number) => api.delete(`/components/${id}`).then(r => r.data)
