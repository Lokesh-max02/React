import { useMemo } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any route element that requires a logged-in user.
// Usage: <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
// Usage with role check: <ProtectedRoute roles={['ROLE_OWNER']}><OwnerLayout /></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()
  // Navigate's internal effect re-runs on every render of this component with
  // no dependency array — an unstable `state` object here would otherwise
  // cause repeated navigation calls. Memoizing it keeps redirects one-shot.
  const redirectState = useMemo(() => ({ from: location.pathname }), [location.pathname])

  if (loading) {
    // Auth state is still rehydrating from localStorage — avoid a login flash.
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={redirectState} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
