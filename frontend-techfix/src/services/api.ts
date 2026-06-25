const API = 'http://localhost:8000/api'

export const ping = () =>
  fetch(`${API}/ping`).then(res => res.json())

export const getUsers = () =>
  fetch(`${API}/users`).then(res => res.json())

export const getRoles = () =>
  fetch(`${API}/roles`).then(res => res.json())

export const createClient = (data: {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  ci: string
}) =>
  fetch(`${API}/clients`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async res => {
    const json = await res.json()
    if (!res.ok) throw json
    return json
  })

export const createComponent = (data: {
  nombre: string
  descripcion?: string
  cantidad: number
  precio_unitario: number
}) =>
  fetch(`${API}/components`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async res => {
    const json = await res.json()
    if (!res.ok) throw json
    return json
  })
