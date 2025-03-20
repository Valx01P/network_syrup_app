import express from 'express'
import eventController from '../controllers/eventController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// Routes for interacting with events collection
router.route('/')
  // Get all PAGINATED public events (with optional filtering)
  .get(eventController.getAllEvents)
  // Create new event (requires authentication)
  .post(verifyJWT, eventController.createEvent)

// Routes for events by ID
router.route('/:id')
  // Get event by ID
  .get(eventController.getEventById)
  // Update event (organizer only)
  .put(verifyJWT, eventController.updateEvent)
  // Delete event (organizer only)
  .delete(verifyJWT, eventController.deleteEvent)

// Join event by code (after onboarding, gets form data, makes attendee)
router.route('/join/:code')
  .post(verifyJWT, eventController.joinEvent)

// Guest join (no login required)
router.route('/join-guest/:code')
  .post(eventController.joinEventAsGuest)

// Toggle event active status (organizer only)
router.route('/:id/toggle-active')
  .put(verifyJWT, eventController.toggleEventActive)

// Get attendees for an event
router.route('/:id/attendees')
  .get(eventController.getEventAttendees)

export default router

// import express from 'express'
// import eventController from '../controllers/eventController.js'
// import verifyJWT from '../middleware/verifyJWT.js'

// const router = express.Router()

// // Routes for interacting with events collection
// router.route('/')
//   // Get all PAGINATED public events (with optional filtering)
//   .get(eventController.getAllEvents)
//   // Create new event (requires authentication)
//   .post(verifyJWT, eventController.createEvent)

// // Routes for events by ID
// router.route('/:id')
//   // Get event by ID
//   .get(eventController.getEventById)
//   // Update event (organizer only)
//   .put(verifyJWT, eventController.updateEvent)
//   // Delete event (organizer only)
//   .delete(verifyJWT, eventController.deleteEvent)

// // Join event by code (after onboarding, gets form data, makes attendee)
// router.route('/join/:code')
//   .post(verifyJWT, eventController.joinEvent)


// export default router