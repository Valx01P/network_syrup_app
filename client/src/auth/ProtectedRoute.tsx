import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

interface ProtectedRouteProps {
  requiredRole: Array<'user' | 'guest'>
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const location = useLocation()
  const { isAuthenticated, isGuest } = useAuthStore()
  
  // Check if the user's role meets the requirements
  const hasRequiredRole = (
    (requiredRole.includes('user') && isAuthenticated) ||
    (requiredRole.includes('guest') && isGuest)
  )
  
  if (!hasRequiredRole) {
    // Redirect to the login page with the return url
    return <Navigate to="/" state={{ from: location }} replace />
  }
  
  return <Outlet />
}

export default ProtectedRoute
