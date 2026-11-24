/**
 * Minimal auth token storage. The JWT lives in localStorage so that a page
 * reload keeps the session; the backend remains the only source of truth
 * because every request carries the token and the API re-validates it.
 */

const TOKEN_KEY = 'orthodent.token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return getToken() !== null
}
