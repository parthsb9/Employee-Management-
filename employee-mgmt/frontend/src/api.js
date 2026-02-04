import axios from 'axios'

/**
 * In dev, vite proxy maps /api -> http://localhost:8000/api
 * So we can safely use baseURL '/api/v1'
 * If you deploy without proxy, set VITE_API_BASE to full URL.
 */
const API_BASE = import.meta.env.VITE_API_BASE || '/api/v1'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
})

// Interceptor for basic error logging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // eslint-disable-next-line no-console
    console.error('API Error:', err?.response?.status, err?.response?.data || err?.message)
    return Promise.reject(err)
  }
)

// Employee API helpers
export const employeesApi = {
  list: (params) => api.get('/employees', { params }).then(r => r.data),
  get: (id) => api.get(`/employees/${id}`).then(r => r.data),
  create: (payload) => api.post('/employees', payload).then(r => r.data),
  update: (id, payload) => api.put(`/employees/${id}`, payload).then(r => r.data),
  remove: (id) => api.delete(`/employees/${id}`).then(r => r.data),
}