import express from 'express'
import userController from '../controllers/userController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// Current user profile operations
router.route('/me')
  // Get current user profile
  .get(verifyJWT, userController.getMe)
  // Update user profile
  .put(verifyJWT, userController.updateMe)
  // Delete user account
  .delete(verifyJWT, userController.deleteMe)

// Get user by ID (for public profiles)
router.route('/:id')
  .get(userController.getUserById)


  // Get past events for current user
router.route('/events/previously-attended')
.get(verifyJWT, userController.getUserEvents)

// Get created events for current user
router.route('/events/you-created')
.get(verifyJWT, userController.getUserCreatedEvents)


export default router