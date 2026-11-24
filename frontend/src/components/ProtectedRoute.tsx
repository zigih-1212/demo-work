import { Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import { isAuthenticated } from '../lib/auth'

/**
 * Route guard for the authenticated part of the app. It only inspects the
 * presence of a stored token - the API re-validates it on every request, so
 * this is a UX shortcut rather than a security boundary.
 */
export default function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }
  return children
}
