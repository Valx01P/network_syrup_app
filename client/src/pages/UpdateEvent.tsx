import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, Clock, MapPin, Image } from 'lucide-react'
import { useEventStore } from '../stores/eventStore'
import { eventApi, uploadApi } from '../api/axiosApi'
import { Event } from '../types/event'

interface EventFormData {
  event_name: string
  event_description: string
  event_location: string
  event_date: string
  event_time: string
  event_image_banner_url?: string
}

const UpdateEvent = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { updateEvent, isLoading, error, clearError } = useEventStore()
  
  const [formData, setFormData] = useState<EventFormData>({
    event_name: '',
    event_description: '',
    event_location: '',
    event_date: '',
    event_time: '',
    event_image_banner_url: ''
  })
  
  const [bannerImage, setBannerImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [fetchLoading, setFetchLoading] = useState(true)
  
  // Fetch event data when component mounts
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return
      
      try {
        setFetchLoading(true)
        const response = await eventApi.getEventById(id)
        const event: Event = response.data
        
        // Format date for input field (YYYY-MM-DD)
        const formattedDate = new Date(event.event_date).toISOString().split('T')[0]
        
        setFormData({
          event_name: event.event_name,
          event_description: event.event_description,
          event_location: event.event_location,
          event_date: formattedDate,
          event_time: event.event_time,
          event_image_banner_url: event.event_image_banner_url
        })
        
        // Set image preview if exists
        if (event.event_image_banner_url) {
          setImagePreview(event.event_image_banner_url)
        }
      } catch (err) {
        console.error('Error fetching event:', err)
        setFormError('Failed to load event data')
      } finally {
        setFetchLoading(false)
      }
    }
    
    fetchEvent()
  }, [id])
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image file is too large. Maximum size is 5MB.')
        return
      }
      
      setBannerImage(file)
      
      // Create image preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return
    
    setFormError(null)
    clearError()
    
    // Validate form data
    if (!formData.event_name.trim()) {
      setFormError('Event name is required')
      return
    }
    
    if (!formData.event_description.trim()) {
      setFormError('Event description is required')
      return
    }
    
    if (!formData.event_location.trim()) {
      setFormError('Event location is required')
      return
    }
    
    if (!formData.event_date) {
      setFormError('Event date is required')
      return
    }
    
    if (!formData.event_time) {
      setFormError('Event time is required')
      return
    }
    
    try {
      // Upload image if selected
      let imageUrl = formData.event_image_banner_url
      
      if (bannerImage) {
        const uploadResult = await uploadApi.uploadImage(bannerImage, 'event')
        imageUrl = uploadResult.data.url
      }
      
      // Update the event
      const eventData = {
        ...formData,
        event_image_banner_url: imageUrl
      }
      
      const updatedEvent = await updateEvent(id, eventData)
      
      if (updatedEvent) {
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Error updating event:', err)
      setFormError('Failed to update event. Please try again.')
    }
  }
  
  const handleCancel = () => {
    navigate('/dashboard')
  }
  
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center">
            <button
              onClick={handleCancel}
              className="mr-4 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Update Event</h1>
          </div>
          <p className="mt-2 text-gray-600">
            Update the details for your event
          </p>
        </div>
        
        {/* Error message */}
        {(formError || error) && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{formError || error}</span>
          </div>
        )}
        
        {/* Event form */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="space-y-6">
              <div>
                <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">
                  Event Name
                </label>
                <input
                  type="text"
                  id="event_name"
                  name="event_name"
                  value={formData.event_name}
                  onChange={handleChange}
                  placeholder="e.g. Miami Tech Networking Mixer"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="event_description" className="block text-sm font-medium text-gray-700">
                  Event Description
                </label>
                <textarea
                  id="event_description"
                  name="event_description"
                  value={formData.event_description}
                  onChange={handleChange}
                  placeholder="Describe your event details..."
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      Event Date
                    </div>
                  </label>
                  <input
                    type="date"
                    id="event_date"
                    name="event_date"
                    value={formData.event_date}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="event_time" className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-gray-400" />
                      Event Time
                    </div>
                  </label>
                  <input
                    type="time"
                    id="event_time"
                    name="event_time"
                    value={formData.event_time}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="event_location" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    Event Location
                  </div>
                </label>
                <input
                  type="text"
                  id="event_location"
                  name="event_location"
                  value={formData.event_location}
                  onChange={handleChange}
                  placeholder="e.g. Downtown Convention Center, Room 302"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="event_banner" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center">
                    <Image className="h-4 w-4 mr-1 text-gray-400" />
                    Event Banner Image
                  </div>
                </label>
                <div className="mt-1 flex items-center">
                  <input
                    type="file"
                    id="event_banner"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="event_banner"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Choose File
                  </label>
                  <span className="ml-2 text-sm text-gray-500">
                    {bannerImage ? bannerImage.name : 'No new file chosen'}
                  </span>
                </div>
                {imagePreview && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-500 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Banner preview"
                      className="max-h-40 rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="mr-3 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateEvent












// const UpdateEvent = () => {

//   return (
//     <div>
//       <h1>Update Event</h1>
//     </div>
//   )
// }

// export default UpdateEvent