const API = 'http://localhost:8000/api'

export const ping = () =>
  fetch(`${API}/ping`).then(res => res.json())

export const getUsers = () =>
  fetch(`${API}/users`).then(res => res.json())

export const getRoles = () =>
  fetch(`${API}/roles`).then(res => res.json())

export const getClients = () =>
  fetch(`${API}/clients`).then(res => res.json())

export const getDevices = () =>
  fetch(`${API}/devices`).then(res => res.json())

export const createDevice = (data: Record<string, unknown>) =>
  fetch(`${API}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async res => {
    const json = await res.json()
    if (!res.ok) throw json
    return json
  })

export const getDeviceTypes = () => [
  'PC',
  'Laptop',
  'PlayStation',
  'Xbox',
  'Nintendo',
  'Celular',
  'Electrónica general',
]

export const getPhysicalStates = () => ['Bueno', 'Regular', 'Malo']
