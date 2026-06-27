const API = 'http://localhost:8000/api'

export const ping = () =>
  fetch(`${API}/ping`).then(res => res.json())

export const getUsers = () =>
  fetch(`${API}/users`).then(res => res.json())

export const getRoles = () =>
  fetch(`${API}/roles`).then(res => res.json())

export const getClients = (search = '') =>
  fetch(`${API}/clients?search=${search}`).then(res => res.json())

export const getClient = (id: number) =>
  fetch(`${API}/clients/${id}`).then(res => res.json())

export const createClient = (data: Record<string, string>) =>
  fetch(`${API}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.ok ? res.json() : res.json().then(e => Promise.reject(e)))

export const updateClient = (id: number, data: Record<string, string>) =>
  fetch(`${API}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.ok ? res.json() : res.json().then(e => Promise.reject(e)))

export const deleteClient = (id: number) =>
  fetch(`${API}/clients/${id}`, { method: 'DELETE' }).then(res => res.json())
