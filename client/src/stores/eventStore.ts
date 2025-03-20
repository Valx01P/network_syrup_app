import { create } from 'zustand'
import { EventState, Event } from '../types/event'
import { eventApi } from '../api/axiosApi'

const initialState: EventState = {
  currentEvent: null,
  userEvents: [],
  createdEvents: [],
  isLoading: false,
  error: null
}

export const useEventStore = create<EventState & {
  setCurrentEvent: (event: Event) => void
  fetchEventByCode: (code: string) => Promise<Event | null>
  fetchUserEvents: () => Promise<void>
  fetchCreatedEvents: () => Promise<void>
  createEvent: (eventData: any) => Promise<Event | null>
  updateEvent: (id: string, eventData: any) => Promise<Event | null>
  deleteEvent: (id: string) => Promise<boolean>
  toggleEventActive: (id: string) => Promise<Event | null>
  clearCurrentEvent: () => void
  clearError: () => void
}>((set, get) => ({
  ...initialState,
  
  setCurrentEvent: (event) => set({ currentEvent: event }),
  
  fetchEventByCode: async (code) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data } = await eventApi.getEventByCode(code)
      set({ 
        currentEvent: data,
        isLoading: false,
        error: null
      })
      return data
    } catch (error: any) {
      console.error('Error fetching event:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch event'
      })
      return null
    }
  },
  
  fetchUserEvents: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const { data } = await userApi.getUserEvents()
      set({ 
        userEvents: data,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      console.error('Error fetching user events:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch user events'
      })
    }
  },
  
  fetchCreatedEvents: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const { data } = await userApi.getUserCreatedEvents()
      set({ 
        createdEvents: data,
        isLoading: false,
        error: null
      })
    } catch (error: any) {
      console.error('Error fetching created events:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to fetch created events'
      })
    }
  },
  
  createEvent: async (eventData) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data } = await eventApi.createEvent(eventData)
      
      // Update the created events list
      const createdEvents = [...get().createdEvents, data]
      
      set({ 
        createdEvents,
        isLoading: false,
        error: null
      })
      
      return data
    } catch (error: any) {
      console.error('Error creating event:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to create event'
      })
      return null
    }
  },
  
  updateEvent: async (id, eventData) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data } = await eventApi.updateEvent(id, eventData)
      
      // Update the created events list
      const createdEvents = get().createdEvents.map(event => 
        event.id === id ? data : event
      )
      
      set({ 
        createdEvents,
        currentEvent: get().currentEvent?.id === id ? data : get().currentEvent,
        isLoading: false,
        error: null
      })
      
      return data
    } catch (error: any) {
      console.error('Error updating event:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update event'
      })
      return null
    }
  },
  
  deleteEvent: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      await eventApi.deleteEvent(id)
      
      // Update the created events list
      const createdEvents = get().createdEvents.filter(event => event.id !== id)
      
      set({ 
        createdEvents,
        currentEvent: get().currentEvent?.id === id ? null : get().currentEvent,
        isLoading: false,
        error: null
      })
      
      return true
    } catch (error: any) {
      console.error('Error deleting event:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to delete event'
      })
      return false
    }
  },
  
  toggleEventActive: async (id) => {
    set({ isLoading: true, error: null })
    
    try {
      const { data } = await eventApi.toggleEventActive(id)
      
      // Update the created events list
      const createdEvents = get().createdEvents.map(event => 
        event.id === id ? data.event : event
      )
      
      set({ 
        createdEvents,
        currentEvent: get().currentEvent?.id === id ? data.event : get().currentEvent,
        isLoading: false,
        error: null
      })
      
      return data.event
    } catch (error: any) {
      console.error('Error toggling event status:', error)
      set({ 
        isLoading: false,
        error: error.response?.data?.message || 'Failed to toggle event status'
      })
      return null
    }
  },
  
  clearCurrentEvent: () => set({ currentEvent: null }),
  
  clearError: () => set({ error: null })
}))
