const API = 'http://localhost:8000/api'

export const ping = () =>
  fetch(`${API}/ping`).then(res => res.json())

export const getUsers = () =>
  fetch(`${API}/users`).then(res => res.json())

export const getRoles = () =>
  fetch(`${API}/roles`).then(res => res.json())

export const getClients = () =>
  fetch(`${API}/clients`).then(res => res.json())

export const getClientDevices = (clientId: number) =>
  fetch(`${API}/devices?client_id=${clientId}`).then(res => res.json())

export const getDevices = () =>
  fetch(`${API}/devices`).then(res => res.json())

export const getServiceTypes = () =>
  fetch(`${API}/service-types`).then(res => res.json())

export const createServiceOrder = (data: Record<string, unknown>) =>
  fetch(`${API}/service-orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async res => {
    const json = await res.json()
    if (!res.ok) throw json
    return json
  })
