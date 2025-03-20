import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Users, Calendar, Clock, Download } from 'lucide-react'
import { eventApi } from '../api/axiosApi'
import { attendeeApi } from '../api/axiosApi'
import { Event } from '../types/event'
import { Attendee } from '../types/attendee'

const EventAdminStatistics = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  
  const [event, setEvent] = useState<Event | null>(null)
  const [attendees, setAttendees] = useState<Attendee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Stats
  const [stats, setStats] = useState({
    totalAttendees: 0,
    guestCount: 0,
    userCount: 0,
    attendeeWithLinkedIn: 0,
    attendeeWithIntro: 0
  })
  
  // Fetch event data and attendees
  useEffect(() => {
    const fetchEventData = async () => {
      if (!id) {
        navigate('/dashboard')
        return
      }
      
      try {
        setLoading(true)
        
        // Fetch event details
        const eventResponse = await eventApi.getEventById(id)
        const eventData: Event = eventResponse.data
        
        if (!eventData) {
          setError('Event not found')
          return
        }
        
        setEvent(eventData)
        
        // Fetch all attendees for this event
        const attendeesResponse = await attendeeApi.getEventAttendees(id)
        const attendeesData: Attendee[] = attendeesResponse.data
        
        setAttendees(attendeesData)
        
        // Calculate stats
        const totalAttendees = attendeesData.length
        const guestCount = attendeesData.filter(a => a.guest).length
        const userCount = attendeesData.filter(a => !a.guest).length
        const attendeeWithLinkedIn = attendeesData.filter(a => a.linkedin_url).length
        const attendeeWithIntro = attendeesData.filter(a => a.intro && a.intro.trim() !== '').length
        
        setStats({
          totalAttendees,
          guestCount,
          userCount,
          attendeeWithLinkedIn,
          attendeeWithIntro
        })
        
      } catch (err) {
        console.error('Error fetching event data:', err)
        setError('Failed to load event data')
      } finally {
        setLoading(false)
      }
    }
    
    fetchEventData()
  }, [id, navigate])
  
  // Export attendees as CSV
  const exportAttendeesCSV = () => {
    if (!attendees.length) return
    
    // CSV header
    const headers = [
      'First Name',
      'Last Name',
      'Email',
      'Guest',
      'LinkedIn URL',
      'Introduction',
      'Interests',
      'Joined At'
    ]
    
    // Format attendees data for CSV
    const csvData = attendees.map(attendee => [
      attendee.first_name,
      attendee.last_name,
      attendee.email,
      attendee.guest ? 'Yes' : 'No',
      attendee.linkedin_url || '',
      attendee.intro ? `"${attendee.intro.replace(/"/g, '""')}"` : '',
      attendee.interests ? `"${attendee.interests.replace(/"/g, '""')}"` : '',
      new Date(attendee.joined_at).toLocaleString()
    ])
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n')
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${event?.event_name.replace(/\s+/g, '_')}_attendees.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  
  // Return to dashboard
  const handleReturnToDashboard = () => {
    navigate('/dashboard')
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md text-center mb-6">
          <h2 className="font-bold text-lg mb-2">Error</h2>
          <p>{error || 'Event information not available'}</p>
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
                Event Statistics
              </p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <button
                onClick={exportAttendeesCSV}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Attendees
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Event details */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Event Details
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Date
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(event.event_date).toLocaleDateString()}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Time
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {event.event_time}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {event.event_location}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Event Code</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                    {event.event_code}
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${
                    event.event_is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {event.event_is_active ? 'Active' : 'Inactive'}
                  </span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Total Attendees */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Attendees
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.totalAttendees}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Registered Users vs Guests */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Registered Users
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.userCount} ({stats.totalAttendees ? Math.round((stats.userCount / stats.totalAttendees) * 100) : 0}%)
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* Guest Users */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Guest Attendees
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.guestCount} ({stats.totalAttendees ? Math.round((stats.guestCount / stats.totalAttendees) * 100) : 0}%)
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* With LinkedIn */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-700 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      With LinkedIn Profile
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.attendeeWithLinkedIn} ({stats.totalAttendees ? Math.round((stats.attendeeWithLinkedIn / stats.totalAttendees) * 100) : 0}%)
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          {/* With Intro */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      With Introduction
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stats.attendeeWithIntro} ({stats.totalAttendees ? Math.round((stats.attendeeWithIntro / stats.totalAttendees) * 100) : 0}%)
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Attendee List */}
        <div className="bg-white shadow sm:rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Attendees List
            </h3>
            <span className="text-sm text-gray-500">
              {attendees.length} total attendees
            </span>
          </div>
          <div className="border-t border-gray-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendees.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        No attendees found
                      </td>
                    </tr>
                  ) : (
                    attendees.map((attendee) => (
                      <tr key={attendee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {attendee.profile_image_url ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={attendee.profile_image_url}
                                  alt=""
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                  {attendee.first_name[0]}{attendee.last_name[0]}
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {attendee.first_name} {attendee.last_name}
                              </div>
                              {attendee.interests && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {attendee.interests.substring(0, 30)}
                                  {attendee.interests.length > 30 ? '...' : ''}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{attendee.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            attendee.guest 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {attendee.guest ? 'Guest' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(attendee.joined_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventAdminStatistics










// const EventAdminStatistics = () => {
//   return (
//     <div>
//       <h1>Event Admin Statistics</h1>
//     </div>
//   )
// }

// export default EventAdminStatistics