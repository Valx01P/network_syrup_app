import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Users, MapPin } from 'lucide-react'
import { useSocketStore } from '../stores/socketStore'
import { useAttendeeStore } from '../stores/attendeeStore'
import { Event } from '../types/event'
import ProfileSidePanel from '../components/ProfileSidePanel'
import { Attendee } from '../types/attendee'

const EventLobby = () => {
  const navigate = useNavigate()
  const { 
    socket, 
    isConnected, 
    error: socketError,
    onNetworkingStarted,
    leaveEvent
  } = useSocketStore()
  
  const { 
    currentAttendee,
    eventAttendees,
    fetchEventAttendees
  } = useAttendeeStore()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)
  
  // Load event data from localStorage
  useEffect(() => {
    const eventData = localStorage.getItem('selectedEvent')
    
    if (!eventData) {
      // No event data, redirect back to join page
      navigate('/')
      return
    }
    
    try {
      const parsedEvent = JSON.parse(eventData)
      setEvent(parsedEvent)
      
      // Listen for networking start
      onNetworkingStarted((networkingData) => {
        // Save networking data to localStorage
        localStorage.setItem('networkingSession', JSON.stringify(networkingData))
        
        // Navigate to networking page
        navigate('/event/networking')
      })
      
    } catch (err) {
      console.error('Error parsing event data:', err)
      setError('Failed to load event data')
    } finally {
      setLoading(false)
    }
  }, [navigate, onNetworkingStarted])
  
  // Fetch event attendees
  useEffect(() => {
    if (event && event.id) {
      fetchEventAttendees(event.id)
    }
  }, [event, fetchEventAttendees])
  
  // Handle user exit
  const handleLeaveEvent = async () => {
    try {
      await leaveEvent()
      navigate('/')
    } catch (err) {
      console.error('Error leaving event:', err)
      setError('Failed to leave event')
    }
  }
  
  // Open attendee profile side panel
  const openAttendeeProfile = (attendee: Attendee) => {
    setSelectedAttendee(attendee)
  }
  
  // Close attendee profile side panel
  const closeAttendeeProfile = () => {
    setSelectedAttendee(null)
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (error || socketError || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center mb-6">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error || socketError || 'Event information not available'}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Home
        </button>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Event header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold">{event.event_name}</h1>
              
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                <div className="flex items-center mt-2 sm:mt-0">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>{new Date(event.event_date).toLocaleDateString()} at {event.event_time}</span>
                </div>
                
                <div className="flex items-center mt-2 sm:mt-0">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{event.event_location}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleLeaveEvent}
                className="px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 transition-colors"
              >
                Leave Event
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Status message */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="px-6 py-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Waiting for the event to start</h2>
            <p className="text-gray-600">
              The organizer will start the networking session soon. In the meantime, you can check out who else is attending.
            </p>
          </div>
        </div>
        
        {/* Attendee list */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Attendees ({eventAttendees.length})
              </h3>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">People in the room</span>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {eventAttendees.length === 0 ? (
              <div className="px-6 py-4 text-center text-gray-500">
                No attendees yet.
              </div>
            ) : (
              eventAttendees.map((attendee) => (
                <div
                  key={attendee.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors flex items-center"
                  onClick={() => openAttendeeProfile(attendee)}
                >
                  {/* Profile image */}
                  {attendee.profile_image_url ? (
                    <img
                      src={attendee.profile_image_url}
                      alt={`${attendee.first_name} ${attendee.last_name}`}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                      {attendee.first_name[0]}{attendee.last_name[0]}
                    </div>
                  )}
                  
                  {/* Attendee info */}
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      {attendee.first_name} {attendee.last_name}
                      {currentAttendee?.id === attendee.id && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          You
                        </span>
                      )}
                    </h4>
                    <p className="text-sm text-gray-500 truncate max-w-md">
                      {attendee.intro?.substring(0, 60) || 'No introduction'}
                      {attendee.intro && attendee.intro.length > 60 ? '...' : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Profile side panel */}
      <ProfileSidePanel
        attendee={selectedAttendee}
        isOpen={!!selectedAttendee}
        onClose={closeAttendeeProfile}
      />
    </div>
  )
}

export default EventLobby






// const EventLobby = () => {
//   return (
//     <div>
//       <h1>Event Lobby</h1>
//     </div>
//   )
// }

// export default EventLobby