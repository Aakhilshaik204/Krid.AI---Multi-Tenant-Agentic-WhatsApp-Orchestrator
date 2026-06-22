import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const getTenants = () => api.get('/tenants')
export const getSessions = (tenantId) => api.get(`/sessions?tenant_id=${tenantId}`)
export const getMessages = (sessionId) => api.get(`/messages?session_id=${sessionId}`)
export const getStats = (tenantId) => api.get(`/stats?tenant_id=${tenantId}`)
export const sendBroadcast = (data) => api.post('/broadcast', data)
export const generateBroadcast = (data) => api.post('/generate-broadcast', data)

export default api
