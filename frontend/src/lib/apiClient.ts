import axios, { AxiosError } from 'axios'
import { clearToken, getToken } from './auth'

/**
 * Base URL of the OrthoDent API.
 *
 * In development Vite proxies `/api` to the FastAPI server on :8000, so the
 * default relative path works without any environment configuration.
 * In production the API host is injected at build time via VITE_API_BASE_URL.
 */
export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // A rejected token must not leave the UI in a half-authenticated state:
    // drop it and let the route guard redirect to the login screen.
    if (error.response?.status === 401 && getToken()) {
      clearToken()
      if (window.location.pathname !== '/login') {
        window.location.assign('/login')
      }
    }
    return Promise.reject(error)
  },
)

/**
 * Turns any thrown value into a message that can be shown to the user.
 * FastAPI returns `detail` as a string for errors and as a list of objects
 * for 422 validation errors, so both shapes are handled.
 */
export function extractApiError(error: unknown, fallback = 'Что-то пошло не так'): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const data = error.response.data as { detail?: unknown } | undefined
      const detail = data?.detail
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail) && detail.length > 0) {
        const first = detail[0] as { msg?: string }
        if (first?.msg) return first.msg
      }
      return `${fallback} (HTTP ${error.response.status})`
    }
    if (error.code === 'ERR_NETWORK') {
      return 'Сервер недоступен. Проверьте, что бэкенд запущен.'
    }
    return error.message || fallback
  }
  if (error instanceof Error) return error.message
  return fallback
}
