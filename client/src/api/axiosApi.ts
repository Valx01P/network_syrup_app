import axios from 'axios'

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true
})

// Add request interceptor to include auth token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const { accessToken } = refreshResponse.data

        // Save the new token
        localStorage.setItem('accessToken', accessToken)

        // Update the original request header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`

        // Retry the original request
        return api(originalRequest)
      } catch (refreshError) {
        // If refresh fails, clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        window.location.href = '/'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  loginWithLinkedin: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/linkedin/login`
  },
  loginWithGoogle: () => {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/auth/google/login`
  },
  logout: () => api.post('/auth/logout')
}

// User API
export const userApi = {
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (data: any) => api.put('/users/me', data),
  deleteAccount: () => api.delete('/users/me'),
  getUserEvents: () => api.get('/users/events/previously-attended'),
  getUserCreatedEvents: () => api.get('/users/events/you-created')
}

// Event API
export const eventApi = {
  getEventByCode: (code: string) => api.get(`/events/join/${code}`),
  getAllEvents: (page = 0, limit = 10) => api.get(`/events?page=${page}&limit=${limit}`),
  getEventById: (id: string) => api.get(`/events/${id}`),
  createEvent: (data: any) => api.post('/events', data),
  updateEvent: (id: string, data: any) => api.put(`/events/${id}`, data),
  deleteEvent: (id: string) => api.delete(`/events/${id}`),
  joinEvent: (code: string, data: any) => api.post(`/events/join/${code}`, data),
  joinEventAsGuest: (code: string, data: any) => api.post(`/events/join-guest/${code}`, data),
  toggleEventActive: (id: string) => api.put(`/events/${id}/toggle-active`),
  getEventAttendees: (id: string) => api.get(`/events/${id}/attendees`)
}

// Attendee API
export const attendeeApi = {
  updateAttendee: (id: string, data: any) => api.put(`/attendees/${id}`, data),
  markAttendeeAbsent: (id: string) => api.put(`/attendees/${id}/leave`),
  getAttendeeById: (id: string) => api.get(`/attendees/${id}`),
  getEventAttendees: (eventId: string) => api.get(`/attendees/event/${eventId}`)
}

// Upload API
export const uploadApi = {
  uploadImage: (file: File, type: 'profile' | 'event') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('type', type)
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },
  deleteImage: (key: string) => api.delete(`/upload/image/${key}`)
}

export default api