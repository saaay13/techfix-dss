import api from './api'

export const getComponentSwaps = () => api.get('/component-swaps').then(r => r.data)
export const getComponentSwap = (id: number) => api.get(`/component-swaps/${id}`).then(r => r.data)
export const createComponentSwap = (data: Record<string, unknown>) => api.post('/component-swaps', data).then(r => r.data)
