import type { InternalAxiosRequestConfig } from 'axios'
import api from './api'
import { authService } from './authService'

type QueueItem = {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

let isRefreshing = false
let failedQueue: QueueItem[] = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error)
    } else {
      item.resolve(token!)
    }
  })
  failedQueue = []
}

async function getAuthStore() {
  const { useAuthStore } = await import('@/stores/authStore')
  return useAuthStore.getState()
}

export function setupInterceptors() {
  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const store = await getAuthStore()
    const token = store.token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean
      }

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
        store.setToken(newToken)
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
