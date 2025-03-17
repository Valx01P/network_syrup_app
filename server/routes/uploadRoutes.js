import express from 'express'
import uploadController from '../controllers/uploadController.js'
import verifyJWT from '../middleware/verifyJWT.js'

const router = express.Router()

// Upload image (profile or event banner)
router.post('/image', verifyJWT, uploadController.uploadImage)

// Delete image
router.delete('/image/:key', verifyJWT, uploadController.deleteImage)

export default router