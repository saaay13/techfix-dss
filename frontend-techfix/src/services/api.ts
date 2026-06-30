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

export const createUser = (data: Record<string, unknown>) =>
  api.post('/users', data).then(r => r.data)

export const updateUser = (id: number, data: Record<string, unknown>) =>
  api.put(`/users/${id}`, data).then(r => r.data)

export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`).then(r => r.data)

export const getRoles = () => api.get('/roles').then(r => r.data)

export const createClient = (data: {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  ci: string
}) =>
  api.post('/clients', data).then(r => r.data)

export const getCriticalStock = () =>
  api.get('/components/critical-stock').then(r => r.data)
