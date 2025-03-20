import PostgresService from '../services/postgresService.js'
import generateRandomCode from '../utils/generateRandomCode.js'
import verifyOwnership from '../utils/verifyOwnership.js'

const Event = new PostgresService('events')
const Attendee = new PostgresService('attendees')
const User = new PostgresService('users')

const eventController = {
  getAllEvents: async (req, res) => {
    try {
      // Implement pagination
      const page = parseInt(req.query.page, 10) || 0
      const limit = parseInt(req.query.limit, 10) || 10
      
      // Basic events list with pagination
      const events = await Event.get_paginated_data_basic(limit, page)
      
      res.status(200).json(events)
    } catch (error) {
      console.error('Error fetching events:', error)
      res.status(500).json({ message: 'Failed to fetch events' })
    }
  },

  createEvent: async (req, res) => {
    try {
      const userId = req.jwt_user.userId
      
      // Generate a unique 6-digit event code
      let eventCode
      let isCodeUnique = false
      
      while (!isCodeUnique) {
        eventCode = generateRandomCode(6)
        const existingEvents = await Event.get_by_field('event_code', eventCode)
        isCodeUnique = existingEvents.length === 0
      }
      
      const eventData = {
        organizer_id: userId,
        event_name: req.body.event_name,
        event_description: req.body.event_description,
        event_location: req.body.event_location,
        event_date: req.body.event_date,
        event_time: req.body.event_time,
        event_code: eventCode,
        event_image_banner_url: req.body.event_image_banner_url || null,
        created_at: new Date(),
        updated_at: new Date()
      }
      
      const newEvent = await Event.save(eventData)
      
      res.status(201).json(newEvent)
    } catch (error) {
      console.error('Error creating event:', error)
      res.status(500).json({ message: 'Failed to create event' })
    }
  },

  getEventById: async (req, res) => {
    try {
      const { id } = req.params
      const event = await Event.get_by_id(id)
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      res.status(200).json(event)
    } catch (error) {
      console.error('Error fetching event:', error)
      res.status(500).json({ message: 'Failed to fetch event' })
    }
  },

  updateEvent: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.jwt_user.userId
      
      // Get the event
      const event = await Event.get_by_id(id)
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      // Check if the user is the organizer
      if (event.organizer_id !== userId) {
        return res.status(403).json({ message: 'Only the event organizer can update this event' })
      }
      
      // Fields that can be updated
      const allowedFields = [
        'event_name', 
        'event_description', 
        'event_location', 
        'event_date', 
        'event_time',
        'event_image_banner_url'
      ]
      
      const updateData = {}
      
      // Filter request body to only include allowed fields
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field]
        }
      })
      
      // Add updated timestamp
      updateData.updated_at = new Date()
      
      const updatedEvent = await Event.update(id, updateData)
      
      res.status(200).json(updatedEvent)
    } catch (error) {
      console.error('Error updating event:', error)
      res.status(500).json({ message: 'Failed to update event' })
    }
  },

  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.jwt_user.userId
      
      // Get the event
      const event = await Event.get_by_id(id)
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      // Check if the user is the organizer
      if (event.organizer_id !== userId) {
        return res.status(403).json({ message: 'Only the event organizer can delete this event' })
      }
      
      // Delete the event
      const deletedEvent = await Event.delete(id)
      
      res.status(200).json({ message: 'Event deleted successfully' })
    } catch (error) {
      console.error('Error deleting event:', error)
      res.status(500).json({ message: 'Failed to delete event' })
    }
  },

  joinEvent: async (req, res) => {
    try {
      const { code } = req.params
      const userId = req.jwt_user.userId
      
      // Get the event by code
      const events = await Event.get_by_field('event_code', code)
      
      if (events.length === 0) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      const event = events[0]
      
      // Check if the event is active
      if (!event.event_is_active) {
        return res.status(400).json({ message: 'This event is not currently active' })
      }
      
      // Check if user is already registered for this event
      const existingAttendees = await Attendee.get_by_fields({
        user_id: userId,
        event_id: event.id
      })
      
      if (existingAttendees.length > 0) {
        return res.status(400).json({ message: 'You are already registered for this event' })
      }
      
      // Get user details
      const user = await User.get_by_id(userId)
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      
      // Create attendee record
      const attendeeData = {
        guest: false,
        user_id: userId,
        event_id: event.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        intro: req.body.intro || user.intro || '',
        interests: req.body.interests || user.interests || '',
        linkedin_url: user.linkedin_url || '',
        profile_image_url: user.profile_image_url || '',
        is_present: true,
        joined_at: new Date()
      }
      
      const newAttendee = await Attendee.save(attendeeData)
      
      res.status(201).json({
        message: 'Successfully joined event',
        attendee: newAttendee,
        event: event
      })
    } catch (error) {
      console.error('Error joining event:', error)
      res.status(500).json({ message: 'Failed to join event' })
    }
  },

  // For guests (not logged in)
  joinEventAsGuest: async (req, res) => {
    try {
      const { code } = req.params
      
      // Get the event by code
      const events = await Event.get_by_field('event_code', code)
      
      if (events.length === 0) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      const event = events[0]
      
      // Check if the event is active
      if (!event.event_is_active) {
        return res.status(400).json({ message: 'This event is not currently active' })
      }
      
      // Validate required fields
      const requiredFields = ['first_name', 'last_name', 'email', 'intro', 'interests']
      for (const field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ message: `${field} is required` })
        }
      }
      
      // Create attendee record
      const attendeeData = {
        guest: true,
        event_id: event.id,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        intro: req.body.intro || '',
        interests: req.body.interests || '',
        linkedin_url: req.body.linkedin_url || '',
        profile_image_url: req.body.profile_image_url || '',
        is_present: true,
        joined_at: new Date()
      }
      
      const newAttendee = await Attendee.save(attendeeData)
      
      res.status(201).json({
        message: 'Successfully joined event as guest',
        attendee: newAttendee,
        event: event
      })
    } catch (error) {
      console.error('Error joining event as guest:', error)
      res.status(500).json({ message: 'Failed to join event as guest' })
    }
  },

  // Event status control
  toggleEventActive: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.jwt_user.userId
      
      // Get the event
      const event = await Event.get_by_id(id)
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      // Check if the user is the organizer
      if (event.organizer_id !== userId) {
        return res.status(403).json({ message: 'Only the event organizer can control this event' })
      }
      
      // Toggle the active status
      const newStatus = !event.event_is_active
      
      const updatedEvent = await Event.update(id, {
        event_is_active: newStatus,
        updated_at: new Date()
      })
      
      res.status(200).json({
        message: `Event is now ${newStatus ? 'active' : 'inactive'}`,
        event: updatedEvent
      })
    } catch (error) {
      console.error('Error toggling event status:', error)
      res.status(500).json({ message: 'Failed to toggle event status' })
    }
  },

  getEventAttendees: async (req, res) => {
    try {
      const { id } = req.params
      
      // Get the event
      const event = await Event.get_by_id(id)
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      // Get all attendees for this event, only those who are present
      const attendees = await Attendee.get_by_fields({
        event_id: id,
        is_present: true
      })
      
      res.status(200).json(attendees)
    } catch (error) {
      console.error('Error fetching event attendees:', error)
      res.status(500).json({ message: 'Failed to fetch attendees' })
    }
  }
}

export default eventController

// const eventController = {
//   async getAllEvents(req, res) {

//   },
//   async createEvent(req, res) {

//   },
//   async getEventById(req, res) {

//   },
//   async updateEvent(req, res) {

//   },
//   async deleteEvent(req, res) {

//   },
//   async joinEvent(req, res) {

//   },
//   async getEventAttendees(req, res) {

//   },
// }

// export default eventController