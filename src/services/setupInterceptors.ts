import type { InternalAxiosRequestConfig } from 'axios'
import api from './api'
import { authService } from './authService'

// ── Business-level error type (HTTP 200 nhưng success: false) ─────────────
export interface ApiErrorData {
  code: number
  success: false
  message: string | null
  data: unknown
}

export interface ApiError extends Error {
  apiData?: ApiErrorData
}

// ── Refresh queue ─────────────────────────────────────────────────────────
type QueueItem = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((item) => {
    if (error) item.reject(error)
    else item.resolve(token!)
  })
  failedQueue = []
}

async function getAuthStore() {
  const { useAuthStore } = await import('@/stores/authStore')
  return useAuthStore.getState()
}

export function setupInterceptors() {
  // ── Request: attach Bearer token ──────────────────────────────────────
  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const { token } = await getAuthStore()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // ── Response: handle business errors + 401 refresh ───────────────────
  api.interceptors.response.use(
    (response) => {
      // Theo API_GUIDES §4: luôn check success trong body
      const body = response.data
      if (body && body.success === false) {
        const err = new Error(body.message ?? 'Business error') as ApiError
        err.apiData = body
        return Promise.reject(err)
      }
      return response
    },
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

      // Chỉ retry 401 và chưa retry
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await authService.refresh()
        const newToken = data.data.accessToken
        const store = await getAuthStore()
        // login cập nhật token + user
        store.login(newToken, data.data.user)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError)
        const store = await getAuthStore()
        store.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    },
  )
}
