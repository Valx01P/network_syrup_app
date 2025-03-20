import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

const AuthCallback = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const setAccessToken = useAuthStore(state => state.setAccessToken)
  const fetchCurrentUser = useAuthStore(state => state.fetchCurrentUser)
  
  useEffect(() => {
    const handleCallback = async () => {
      if (token) {
        // Store the token
        setAccessToken(token)
        
        // Fetch current user info
        await fetchCurrentUser()
        
        // Check if there was a stored event to return to
        const storedEvent = localStorage.getItem('selectedEvent')
        if (storedEvent) {
          navigate('/onboarding/form')
        } else {
          navigate('/dashboard')
        }
      } else {
        // No token, redirect to login page
        navigate('/onboarding/auth', { 
          state: { error: 'Authentication failed. Please try again.' } 
        })
      }
    }
    
    handleCallback()
  }, [token, navigate, setAccessToken, fetchCurrentUser])
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-gray-900">Processing your login...</h3>
        <p className="mt-1 text-sm text-gray-500">Please wait while we securely sign you in.</p>
      </div>
    </div>
  )
}

export default AuthCallback