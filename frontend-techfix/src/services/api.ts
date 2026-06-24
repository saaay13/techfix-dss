const API = 'http://localhost:8000/api'

export const ping = () =>
  fetch(`${API}/ping`).then(res => res.json())

export const getUsers = () =>
  fetch(`${API}/users`).then(res => res.json())

export const getRoles = () =>
  fetch(`${API}/roles`).then(res => res.json())
