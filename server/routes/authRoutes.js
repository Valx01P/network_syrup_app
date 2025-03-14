import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()

// OAuth routes
router.get('/linkedin/login', authController.linkedinLogin)
router.get('/linkedin/callback', authController.linkedinCallback)

router.get('/google/login', authController.googleLogin)
router.get('/google/callback', authController.googleCallback)

// Token management routes
router.post('/refresh', authController.refresh)
router.post('/logout', authController.logout)


export default router