import express from 'express'
import attendeeController from '../controllers/attendeeController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// Attendee by ID operations
router.route('/:id')
  // Update attendee details
  .put(verifyJWT, attendeeController.updateAttendee)

// Get all attendees for a specific event
router.route('/event/:eventId')
  .get(attendeeController.getEventAttendees)


export default router