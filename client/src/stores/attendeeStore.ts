import { create } from 'zustand'
import { AttendeeState, Attendee } from '../types/attendee'
import { attendeeApi } from '../api/axiosApi'

const initialState: AttendeeState = {
  currentAttendee: null,
  eventAttendees: [],
  isLoading: false,
  error: null
}

export const useAttendeeStore = create<AttendeeState & {
  setCurrentAttendee: (attendee: Attendee) => void
  fetchEventAttendees: (eventId: string) => Promise<void>
  updateAttendee: (id: string, data: any) => Promise<Attendee | null>
  markAttendeeAbsent: (id: string) => Promise<boolean>
  addAttendee: (attendee: Attendee) => void
  removeAttendee: (id: string) => void
  clearEventAttendees: () => void
  clearError: () => void
}>((set, get) => ({
  ...initialState,
  
  setCurrentAttendee: (attendee) => set({ currentAttendee: attendee }),
  
  fetchEventAttendees: async (eventId) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data } = await attendeeApi.getEventAttendees(eventId)
      set({ 
        eventAttendees: data,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      console.error('Error fetching event attendees:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch event attendees'
      })
    }
  },
  
  updateAttendee: async (id, data) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await attendeeApi.updateAttendee(id, data)
      const updatedAttendee = response.data
      
      // Update current attendee if it's the same one
      if (get().currentAttendee?.id === id) {
        set({ currentAttendee: updatedAttendee })
      }
      
      // Update in the attendees list
      const eventAttendees = get().eventAttendees.map(attendee => 
        attendee.id === id ? updatedAttendee : attendee
      )
      
      set({ 
        eventAttendees,
        isLoading: false,
        error: null
      })
      
      return updatedAttendee
    } catch (error: any) {
      console.error('Error updating attendee:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update attendee'
      })
      return null
    }
  },
  
  markAttendeeAbsent: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      await attendeeApi.markAttendeeAbsent(id)
      
      // Update in the attendees list
      const eventAttendees = get().eventAttendees.filter(
        attendee => attendee.id !== id
      )
      
      set({ 
        eventAttendees,
        currentAttendee: get().currentAttendee?.id === id ? null : get().currentAttendee,
        isLoading: false,
        error: null
      })
      
      return true
    } catch (error: any) {
      console.error('Error marking attendee absent:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to mark attendee as absent'
      })
      return false
    }
  },
  
  addAttendee: (attendee) => {
    const eventAttendees = [...get().eventAttendees, attendee]
    set({ eventAttendees })
  },
  
  removeAttendee: (id) => {
    const eventAttendees = get().eventAttendees.filter(
      attendee => attendee.id !== id
    )
    set({ eventAttendees })
  },
  
  clearEventAttendees: () => set({ eventAttendees: [] }),
  
  clearError: () => set({ error: null })
}))
