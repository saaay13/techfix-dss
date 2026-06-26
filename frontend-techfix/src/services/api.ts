import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const ping = () => api.get('/ping').then(r => r.data);

export const getUsers = () => api.get('/users').then(r => r.data);

export const getUser = (id: number) => api.get(`/users/${id}`).then(r => r.data);

export const createUser = (data: Record<string, unknown>) =>
  api.post('/users', data).then(r => r.data);

export const updateUser = (id: number, data: Record<string, unknown>) =>
  api.put(`/users/${id}`, data).then(r => r.data);

export const deleteUser = (id: number) =>
  api.delete(`/users/${id}`).then(r => r.data);

export const getRoles = () => api.get('/roles').then(r => r.data);

export const createClient = (data: {
  nombre: string
  apellido: string
  telefono: string
  correo: string
  ci: string
}) =>
  api.post('/clients', data).then(r => r.data);

export default api;
