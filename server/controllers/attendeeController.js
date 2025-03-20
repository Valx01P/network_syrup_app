import PostgresService from '../services/postgresService.js'
import verifyOwnership from '../utils/verifyOwnership.js'

const Attendee = new PostgresService('attendees')
const Event = new PostgresService('events')

const attendeeController = {
  updateAttendee: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.jwt_user.userId
      
      // Get the attendee
      const attendee = await Attendee.get_by_id(id)
      
      if (!attendee) {
        return res.status(404).json({ message: 'Attendee record not found' })
      }
      
      // If the attendee is a registered user, verify ownership
      if (!attendee.guest && attendee.user_id !== userId) {
        return res.status(403).json({ message: 'You can only update your own attendee details' })
      }
      
      // Fields that can be updated
      const allowedFields = ['intro', 'interests', 'linkedin_url', 'profile_image_url']
      const updateData = {}
      
      // Filter request body to only include allowed fields
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field]
        }
      })
      
      const updatedAttendee = await Attendee.update(id, updateData)
      
      res.status(200).json(updatedAttendee)
    } catch (error) {
      console.error('Error updating attendee:', error)
      res.status(500).json({ message: 'Failed to update attendee details' })
    }
  },
  
  getEventAttendees: async (req, res) => {
    try {
      const { eventId } = req.params
      
      // Check if event exists
      const event = await Event.get_by_id(eventId)
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' })
      }
      
      // Get all attendees for this event that are currently present
      const attendees = await Attendee.get_by_fields({
        event_id: eventId,
        is_present: true
      })
      
      res.status(200).json(attendees)
    } catch (error) {
      console.error('Error fetching event attendees:', error)
      res.status(500).json({ message: 'Failed to fetch attendees' })
    }
  },
  
  markAttendeeAbsent: async (req, res) => {
    try {
      const { id } = req.params
      const userId = req.jwt_user.userId
      
      // Get the attendee
      const attendee = await Attendee.get_by_id(id)
      
      if (!attendee) {
        return res.status(404).json({ message: 'Attendee record not found' })
      }
      
      // Get the event to check if user is organizer
      const event = await Event.get_by_id(attendee.event_id)
      
      // Only the attendee themselves or the event organizer can mark them as absent
      if ((!attendee.guest && attendee.user_id !== userId) && event.organizer_id !== userId) {
        return res.status(403).json({ message: 'Unauthorized to perform this action' })
      }
      
      // Mark as not present
      const updatedAttendee = await Attendee.update(id, {
        is_present: false
      })
      
      res.status(200).json({
        message: 'Attendee marked as left the event',
        attendee: updatedAttendee
      })
    } catch (error) {
      console.error('Error marking attendee as absent:', error)
      res.status(500).json({ message: 'Failed to update attendee status' })
    }
  },
  
  getAttendeeById: async (req, res) => {
    try {
      const { id } = req.params
      
      const attendee = await Attendee.get_by_id(id)
      
      if (!attendee) {
        return res.status(404).json({ message: 'Attendee not found' })
      }
      
      res.status(200).json(attendee)
    } catch (error) {
      console.error('Error fetching attendee:', error)
      res.status(500).json({ message: 'Failed to fetch attendee' })
    }
  }
}

export default attendeeController

// const attendeeController = {
//   updateAttendee: (req, res) => {
//     // Update attendee details
//   },
//   getEventAttendees: (req, res) => {
//     // Get all attendees for a specific event
//   }
// }