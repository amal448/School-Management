import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getCookie } from '@/utils/cookie.utils'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: unknown) => void
  reject:  (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: unknown = null): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else       resolve(token)  // ✅ pass something meaningful, or just resolve
  })
  failedQueue = []
}

const apiClient = axios.create({
  baseURL:         import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})
const SKIP_REFRESH_URLS = ['/api/auth/me', '/api/auth/refresh', '/api/auth/login']

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

     // ✅ Skip refresh logic for auth-related endpoints
    const isAuthEndpoint = SKIP_REFRESH_URLS.some(url =>
      original.url?.includes(url)
    )

    if (error.response?.status === 401 && !original._retry && !isAuthEndpoint) {
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
        // window.location.href = ROUTES.AUTH.ADMIN_MANAGER_LOGIN
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient