import express from 'express'
import authRoutes from './authRoutes.js'
import eventRoutes from './eventRoutes.js'
import userRoutes from './userRoutes.js'
import attendeeRoutes from './attendeeRoutes.js'
import uploadRoutes from './uploadRoutes.js'

const router = express.Router()

// Mount all route modules
router.use('/auth', authRoutes)
router.use('/events', eventRoutes)
router.use('/users', userRoutes)
router.use('/attendees', attendeeRoutes)
router.use('/uploads', uploadRoutes)

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

export default router