import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Clock } from 'lucide-react'
import { useSocketStore } from '../stores/socketStore'
import { useAttendeeStore } from '../stores/attendeeStore'
import { NetworkingSession, Pair, Group } from '../types/networking'
import ProfileSidePanel from '../components/ProfileSidePanel'
import { Attendee } from '../types/attendee'
import { Event } from '../types/event'

const EventNetworking = () => {
  const navigate = useNavigate()
  const { 
    socket, 
    isConnected, 
    error: socketError,
    onNetworkingEnded,
    onEventEnded,
    leaveEvent
  } = useSocketStore()
  
  const { 
    currentAttendee,
    eventAttendees
  } = useAttendeeStore()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [networkingSession, setNetworkingSession] = useState<NetworkingSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)
  const [timer, setTimer] = useState<number | null>(null)
  
  // Load event and networking data from localStorage
  useEffect(() => {
    const eventData = localStorage.getItem('selectedEvent')
    const networkingData = localStorage.getItem('networkingSession')
    
    if (!eventData || !networkingData) {
      // Missing data, redirect back to lobby
      navigate('/event/lobby')
      return
    }
    
    try {
      const parsedEvent = JSON.parse(eventData)
      const parsedNetworking = JSON.parse(networkingData)
      
      setEvent(parsedEvent)
      setNetworkingSession(parsedNetworking)
      
      // Set a timer for 10 minutes per session
      setTimer(10 * 60)
      
      // Listen for networking end
      onNetworkingEnded(() => {
        navigate('/event/lobby')
      })
      
      // Listen for event end
      onEventEnded(() => {
        navigate('/event/end')
      })
      
    } catch (err) {
      console.error('Error parsing data:', err)
      setError('Failed to load networking session data')
    } finally {
      setLoading(false)
    }
  }, [navigate, onNetworkingEnded, onEventEnded])
  
  // Handle timer countdown
  useEffect(() => {
    if (timer === null) return
    
    const countdown = setInterval(() => {
      setTimer(prevTimer => prevTimer !== null ? prevTimer - 1 : null)
    }, 1000)
    
    return () => clearInterval(countdown)
  }, [timer])
  
  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
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
  const openAttendeeProfile = (attendeeId: string) => {
    const attendee = eventAttendees.find(a => a.id === attendeeId)
    if (attendee) {
      setSelectedAttendee(attendee)
    }
  }
  
  // Close attendee profile side panel
  const closeAttendeeProfile = () => {
    setSelectedAttendee(null)
  }
  
  // Find current pair or group for the user
  const findCurrentNetworkingGroup = () => {
    if (!networkingSession || !currentAttendee) return null
    
    if (networkingSession.type === 'one-on-one' && networkingSession.pairs) {
      return networkingSession.pairs.find(pair => 
        pair.attendees.some(a => a.id === currentAttendee.id)
      )
    } else if (networkingSession.type === 'group' && networkingSession.groups) {
      return networkingSession.groups.find(group => 
        group.attendees.some(a => a.id === currentAttendee.id)
      )
    }
    
    return null
  }
  
  const currentGroup = findCurrentNetworkingGroup()
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (error || socketError || !event || !networkingSession) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center mb-6">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error || socketError || 'Networking session information not available'}</p>
        </div>
        <button
          onClick={() => navigate('/event/lobby')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Lobby
        </button>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold">{event.event_name}</h1>
              <p className="mt-1">Networking Session</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              {timer !== null && (
                <div className="bg-blue-800 px-4 py-2 rounded-md flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span className="font-mono">{formatTime(timer)}</span>
                </div>
              )}
              
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
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {networkingSession.type === 'one-on-one' ? 'One-on-One Networking' : 'Group Networking'}
              </h2>
              <div className="flex items-center">
                {networkingSession.type === 'one-on-one' ? (
                  <UserPlus className="h-5 w-5 text-gray-400 mr-2" />
                ) : (
                  <Users className="h-5 w-5 text-gray-400 mr-2" />
                )}
                <span className="text-sm text-gray-500">
                  {networkingSession.type === 'one-on-one' ? 'Meet your partner' : 'Meet your group'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-6">
            {currentGroup ? (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {networkingSession.type === 'one-on-one' ? 'Your Networking Partner' : 'Your Networking Group'}
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentGroup.attendees
                    .filter(attendee => attendee.id !== currentAttendee?.id)
                    .map(attendee => (
                      <div 
                        key={attendee.id}
                        className="bg-gray-50 rounded-lg p-6 flex flex-col items-center text-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => openAttendeeProfile(attendee.id)}
                      >
                        {/* Profile image */}
                        {attendee.profile_image_url ? (
                          <img
                            src={attendee.profile_image_url}
                            alt={attendee.name}
                            className="h-24 w-24 rounded-full object-cover mb-4"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl mb-4">
                            {attendee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                        
                        <h4 className="text-xl font-medium text-gray-900 mb-2">
                          {attendee.name}
                        </h4>
                        
                        <p className="text-sm text-blue-600 font-medium">
                          View Profile
                        </p>
                      </div>
                    ))}
                </div>
                
                <div className="mt-8 bg-blue-50 rounded-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Networking Tip</h4>
                  <p className="text-gray-700">
                    Take this opportunity to introduce yourself and learn about each other's interests and background. 
                    Ask open-ended questions to keep the conversation flowing!
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  You are not currently assigned to any networking group. Please wait for the organizer to assign you.
                </p>
              </div>
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

export default EventNetworking








// const EventNetworking = () => {
//   return (
//     <div>
//       <h1>EventNetworking</h1>
//     </div>
//   )
// }

// export default EventNetworking;