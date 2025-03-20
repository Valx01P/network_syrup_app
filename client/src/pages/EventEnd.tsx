import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Calendar, Users } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { Event } from '../types/event'

const EventEnd = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const [event, setEvent] = useState<Event | null>(null)
  
  // Load event data from localStorage
  useEffect(() => {
    const eventData = localStorage.getItem('selectedEvent')
    
    if (eventData) {
      try {
        const parsedEvent = JSON.parse(eventData)
        setEvent(parsedEvent)
      } catch (err) {
        console.error('Error parsing event data:', err)
      }
    }
    
    // Cleanup localStorage data when component unmounts
    return () => {
      localStorage.removeItem('selectedEvent')
      localStorage.removeItem('networkingSession')
    }
  }, [])
  
  const handleGoHome = () => {
    navigate('/')
  }
  
  const handleGoDashboard = () => {
    if (isAuthenticated) {
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full mx-auto p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
              <Check className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Event Ended</h1>
            <p className="mt-2 text-gray-600">
              Thank you for participating in {event?.event_name || 'the event'}!
            </p>
          </div>
          
          {event && (
            <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Event Summary
                </h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="font-medium text-gray-900">Date & Time</p>
                      <p className="text-gray-600">
                        {new Date(event.event_date).toLocaleDateString()} at {event.event_time}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-3 text-sm">
                      <p className="font-medium text-gray-900">Location</p>
                      <p className="text-gray-600">{event.event_location}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            {isAuthenticated ? (
              <button
                onClick={handleGoDashboard}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={handleGoHome}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return Home
              </button>
            )}
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                We hope you made some valuable connections!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventEnd









// const EventEnd = () => {
//   return (
//     <div>
//       <h1>Event End</h1>
//     </div>
//   )
// }

// export default EventEnd