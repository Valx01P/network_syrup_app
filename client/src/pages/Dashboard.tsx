import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Calendar, Clock, MapPin, Plus, Users, ToggleLeft, ToggleRight, Edit, Trash2 } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useEventStore } from '../stores/eventStore'
import { Event } from '../types/event'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { 
    userEvents, 
    createdEvents, 
    fetchUserEvents, 
    fetchCreatedEvents,
    toggleEventActive,
    deleteEvent,
    isLoading,
    error,
    clearError
  } = useEventStore()
  
  const [activeTab, setActiveTab] = useState<'created' | 'attended'>('created')
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<string | null>(null)
  
  // Fetch events when component mounts
  useEffect(() => {
    fetchCreatedEvents()
    fetchUserEvents()
  }, [fetchCreatedEvents, fetchUserEvents])
  
  // Format date function
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  // Handle toggle event active status
  const handleToggleActive = async (event: Event) => {
    try {
      await toggleEventActive(event.id)
    } catch (err) {
      console.error('Error toggling event status:', err)
    }
  }
  
  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId)
      setDeleteConfirmationId(null)
    } catch (err) {
      console.error('Error deleting event:', err)
    }
  }
  
  // Cancel delete confirmation
  const cancelDelete = () => {
    setDeleteConfirmationId(null)
  }
  
  // Navigate to create event page
  const navigateToCreateEvent = () => {
    navigate('/create-event')
  }
  
  // Navigate to admin live event page
  const navigateToAdminLiveEvent = (eventId: string) => {
    navigate(`/event-admin/live/${eventId}`)
  }
  
  // Determine which events to display based on active tab
  const displayEvents = activeTab === 'created' ? createdEvents : userEvents
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage your events and see your past event activity
          </p>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={clearError}
            >
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Tab navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('created')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'created'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Events You Created
            </button>
            <button
              onClick={() => setActiveTab('attended')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'attended'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Events You Attended
            </button>
          </nav>
        </div>
        
        {/* Create event button (only in created tab) */}
        {activeTab === 'created' && (
          <div className="mb-6">
            <button
              onClick={navigateToCreateEvent}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create New Event
            </button>
          </div>
        )}
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}
        
        {/* Event list */}
        {!isLoading && (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {displayEvents.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gray-100 mb-4">
                  {activeTab === 'created' ? (
                    <Calendar className="h-6 w-6 text-gray-400" />
                  ) : (
                    <Users className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900">No events found</h3>
                <p className="mt-1 text-gray-500">
                  {activeTab === 'created'
                    ? 'You haven\'t created any events yet.'
                    : 'You haven\'t attended any events yet.'}
                </p>
                {activeTab === 'created' && (
                  <div className="mt-6">
                    <button
                      onClick={navigateToCreateEvent}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create your first event
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {displayEvents.map((event) => (
                  <li key={event.id}>
                    {deleteConfirmationId === event.id ? (
                      <div className="px-6 py-4 flex items-center justify-between bg-red-50">
                        <div className="text-sm text-red-700">
                          <p className="font-medium">Are you sure you want to delete this event?</p>
                          <p className="mt-1">This action cannot be undone.</p>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={cancelDelete}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="px-6 py-4 flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <h3 className="text-lg font-medium text-gray-900 truncate">
                              {event.event_name}
                            </h3>
                            {activeTab === 'created' && (
                              <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                event.event_is_active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {event.event_is_active ? 'Active' : 'Inactive'}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {formatDate(event.event_date)}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {event.event_time}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {event.event_location}
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <div className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                                <span className="font-medium">Code:</span> <span className="ml-1">{event.event_code}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions (only for created events) */}
                        {activeTab === 'created' && (
                          <div className="ml-4 flex-shrink-0 flex space-x-2">
                            <button
                              onClick={() => handleToggleActive(event)}
                              className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                event.event_is_active
                                  ? 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
                                  : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                              }`}
                            >
                              {event.event_is_active ? (
                                <>
                                  <ToggleRight className="h-4 w-4 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </button>
                            
                            {event.event_is_active && (
                              <button
                                onClick={() => navigateToAdminLiveEvent(event.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Manage
                              </button>
                            )}
                            
                            <Link
                              to={`/update-event/${event.id}`}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                            
                            <button
                              onClick={() => setDeleteConfirmationId(event.id)}
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard











// const Dashboard = () => {
//   return (
//     <div>
//       <h1>Dashboard</h1>
//     </div>
//   )
// }

// export default Dashboard;