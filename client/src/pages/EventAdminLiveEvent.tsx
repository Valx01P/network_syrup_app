import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users, UserPlus, UserMinus, Power, Clock } from 'lucide-react'
import { useSocketStore } from '../stores/socketStore'
import { useEventStore } from '../stores/eventStore'
import { useAttendeeStore } from '../stores/attendeeStore'
import { eventApi } from '../api/axiosApi'
import { Event } from '../types/event'
import { NetworkingSession } from '../types/networking'
import ProfileSidePanel from '../components/ProfileSidePanel'
import { Attendee } from '../types/attendee'

const EventAdminLiveEvent = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { 
    socket, 
    isConnected, 
    error: socketError,
    connect,
    organizerJoin,
    organizerLeave,
    startOneOnOneNetworking,
    startGroupNetworking,
    endNetworking,
    endEvent,
    onUserJoined,
    onUserLeft,
    onNetworkingStarted,
    onNetworkingEnded
  } = useSocketStore()
  
  const { 
    eventAttendees,
    clearEventAttendees,
    addAttendee,
    removeAttendee
  } = useAttendeeStore()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAttendee, setSelectedAttendee] = useState<Attendee | null>(null)
  const [isNetworkingActive, setIsNetworkingActive] = useState(false)
  const [networkingType, setNetworkingType] = useState<'one-on-one' | 'group' | null>(null)
  const [groupSize, setGroupSize] = useState(4)
  const [networkingSession, setNetworkingSession] = useState<NetworkingSession | null>(null)
  const [confirmation, setConfirmation] = useState<{
    action: 'end-networking' | 'end-event'
    visible: boolean
  } | null>(null)
  
  // Fetch event data and connect to socket
  useEffect(() => {
    const fetchEventAndConnect = async () => {
      if (!id) {
        navigate('/dashboard')
        return
      }
      
      try {
        setLoading(true)
        
        // Fetch event details
        const response = await eventApi.getEventById(id)
        const eventData: Event = response.data
        
        // Verify event exists and is active
        if (!eventData) {
          setError('Event not found')
          return
        }
        
        setEvent(eventData)
        
        // Connect to socket server and join as organizer
        const token = localStorage.getItem('accessToken')
        if (!token) {
          setError('Authentication required')
          return
        }
        
        connect(token)
        organizerJoin(id)
        
        // Setup socket event listeners
        onUserJoined((data) => {
          console.log('User joined:', data)
          addAttendee(data)
        })
        
        onUserLeft((data) => {
          console.log('User left:', data)
          removeAttendee(data.attendeeId)
        })
        
        onNetworkingStarted((data) => {
          console.log('Networking started:', data)
          setNetworkingSession(data)
          setIsNetworkingActive(true)
          setNetworkingType(data.type)
        })
        
        onNetworkingEnded(() => {
          console.log('Networking ended')
          setNetworkingSession(null)
          setIsNetworkingActive(false)
          setNetworkingType(null)
        })
        
      } catch (err) {
        console.error('Error fetching event:', err)
        setError('Failed to load event data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchEventAndConnect()
    
    // Cleanup when component unmounts
    return () => {
      organizerLeave()
      clearEventAttendees()
    }
  }, [id, navigate, connect, organizerJoin, organizerLeave, onUserJoined, onUserLeft, onNetworkingStarted, onNetworkingEnded, addAttendee, removeAttendee, clearEventAttendees])
  
  // Open attendee profile
  const openAttendeeProfile = (attendee: Attendee) => {
    setSelectedAttendee(attendee)
  }
  
  // Close attendee profile
  const closeAttendeeProfile = () => {
    setSelectedAttendee(null)
  }
  
  // Start one-on-one networking
  const handleStartOneOnOne = () => {
    if (eventAttendees.length < 2) {
      setError('Need at least 2 attendees to start networking')
      return
    }
    
    startOneOnOneNetworking()
  }
  
  // Start group networking
  const handleStartGroup = () => {
    if (eventAttendees.length < 2) {
      setError('Need at least 2 attendees to start networking')
      return
    }
    
    startGroupNetworking(groupSize)
  }
  
  // Handle end networking confirmation
  const confirmEndNetworking = () => {
    setConfirmation({
      action: 'end-networking',
      visible: true
    })
  }
  
  // Handle end event confirmation
  const confirmEndEvent = () => {
    setConfirmation({
      action: 'end-event',
      visible: true
    })
  }
  
  // Execute end networking
  const executeEndNetworking = () => {
    endNetworking()
    setConfirmation(null)
  }
  
  // Execute end event
  const executeEndEvent = () => {
    endEvent()
    setConfirmation(null)
    navigate('/dashboard')
  }
  
  // Cancel confirmation
  const cancelConfirmation = () => {
    setConfirmation(null)
  }
  
  // Return to dashboard
  const handleReturnToDashboard = () => {
    navigate('/dashboard')
  }
  
  // Handle group size change
  const handleGroupSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10)
    if (!isNaN(size) && size >= 2) {
      setGroupSize(size)
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (error || socketError || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center mb-6">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error || socketError || 'Event information not available'}</p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <button
                  onClick={handleReturnToDashboard}
                  className="mr-4 text-white hover:text-blue-200 focus:outline-none"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-2xl font-bold">{event.event_name}</h1>
              </div>
              <p className="mt-1 text-blue-100">
                {new Date(event.event_date).toLocaleDateString()} at {event.event_time}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="mr-4 flex items-center bg-blue-700 px-3 py-1 rounded">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm">{eventAttendees.length} Attendees</span>
              </div>
              
              <div className={`flex items-center px-3 py-1 rounded ${
                event.event_is_active 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-600 text-white'
              }`}>
                <span className="text-sm">
                  {event.event_is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column: Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Organizer Controls
                </h2>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Networking controls */}
                <div className="space-y-4">
                  <h3 className="text-base font-medium text-gray-900">
                    Networking Session
                  </h3>
                  
                  {!isNetworkingActive ? (
                    <div className="space-y-4">
                      <div>
                        <button
                          onClick={handleStartOneOnOne}
                          className="w-full flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Start One-on-One Sessions
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Group Size
                        </label>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="2"
                            value={groupSize}
                            onChange={handleGroupSizeChange}
                            className="block w-20 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                          <button
                            onClick={handleStartGroup}
                            className="flex-1 flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Users className="h-4 w-4 mr-2" />
                            Start Group Sessions
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-green-100 px-4 py-3 rounded-md flex items-start">
                        <div className="flex-shrink-0 mt-1">
                          <Clock className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-green-800">
                            {networkingType === 'one-on-one' ? 'One-on-One' : 'Group'} Networking Active
                          </h3>
                          <p className="mt-1 text-sm text-green-700">
                            {networkingType === 'one-on-one'
                              ? 'Attendees are paired up for one-on-one networking.'
                              : `Attendees are in groups of approximately ${groupSize} people.`
                            }
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={confirmEndNetworking}
                        className="w-full flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                      >
                        <UserMinus className="h-4 w-4 mr-2" />
                        End Networking Session
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Event controls */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-base font-medium text-gray-900">
                    Event Controls
                  </h3>
                  
                  <button
                    onClick={confirmEndEvent}
                    className="w-full flex items-center justify-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <Power className="h-4 w-4 mr-2" />
                    End Event
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column: Attendees */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">
                  Attendees
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {eventAttendees.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                      <Users className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No attendees yet</h3>
                    <p className="mt-1 text-gray-500">
                      Attendees will appear here when they join the event.
                    </p>
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
                      <div className="ml-4 flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {attendee.first_name} {attendee.last_name}
                          {attendee.guest && (
                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Guest
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
        </div>
      </div>
      
      {/* Confirmation modal */}
      {confirmation && confirmation.visible && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {confirmation.action === 'end-networking' 
                        ? 'End Networking Session?' 
                        : 'End Event?'
                      }
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {confirmation.action === 'end-networking'
                          ? 'Are you sure you want to end the current networking session? All attendees will return to the event lobby.'
                          : 'Are you sure you want to end this event? All attendees will be disconnected and the event will be marked as inactive.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    confirmation.action === 'end-networking'
                      ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  }`}
                  onClick={confirmation.action === 'end-networking' ? executeEndNetworking : executeEndEvent}
                >
                  {confirmation.action === 'end-networking' ? 'End Session' : 'End Event'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={cancelConfirmation}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Profile side panel */}
      <ProfileSidePanel
        attendee={selectedAttendee}
        isOpen={!!selectedAttendee}
        onClose={closeAttendeeProfile}
      />
    </div>
  )
}

export default EventAdminLiveEvent











// const EventAdminLiveEvent = () => {
//   return (
//     <div>
//       <h1>Event Admin Live Event</h1>
//     </div>
//   )
// }

// export default EventAdminLiveEvent;
