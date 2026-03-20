import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getCookie } from '@/utils/cookie.utils'
import { ROUTES }    from '@/config/routes.config'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject:  (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else       resolve(null)
  })
  failedQueue = []
}

const apiClient = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Attach CSRF token on mutating requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase()
    if (['post', 'put', 'patch', 'delete'].includes(method ?? '')) {
      const csrf = getCookie('csrfToken')
      if (csrf) config.headers['x-csrf-token'] = csrf
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => apiClient(original))
          .catch((err) => Promise.reject(err))
      }

      original._retry = true
      isRefreshing    = true

      try {
        await apiClient.post('/api/auth/refresh')
        processQueue(null)
        return apiClient(original)
      } catch (refreshError) {
        processQueue(refreshError as AxiosError)
        window.location.href = ROUTES.AUTH.ADMIN_MANAGER_LOGIN
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient