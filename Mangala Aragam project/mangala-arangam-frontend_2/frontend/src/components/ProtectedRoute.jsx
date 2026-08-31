import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wrap any route element that requires a logged-in user.
// Usage: <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
// Usage with role check: <ProtectedRoute roles={['ROLE_OWNER']}><OwnerLayout /></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    // Auth state is still rehydrating from localStorage — avoid a login flash.
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
