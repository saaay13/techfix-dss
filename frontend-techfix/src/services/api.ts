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
