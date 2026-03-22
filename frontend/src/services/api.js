import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000,
})

// Request interceptor – attach auth token if available
api.interceptors.request.use(config => {
  return config
})

// Response interceptor – normalize errors
api.interceptors.response.use(
  response => response.data,
  error => {
    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(message))
  }
)

// ── Resume Analysis ───────────────────────────────────────────
export const analyzeResume = (file, onUploadProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  })
}

// ── Payment ───────────────────────────────────────────────────
export const createPaymentOrder = (analysisId) =>
  api.post('/payment/create-order', { analysis_id: analysisId })

export const verifyPayment = (payload) =>
  api.post('/payment/verify', payload)

// ── Report download ───────────────────────────────────────────
export const downloadReport = async (analysisId) => {
  const response = await axios.get(`/api/download-report/${analysisId}`, {
    responseType: 'blob',
    timeout: 30000,
  })
  const url  = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href  = url
  link.setAttribute('download', `ResumeBooster_Report_${analysisId.slice(0, 8)}.pdf`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export default api
