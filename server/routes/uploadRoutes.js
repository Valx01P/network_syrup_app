import express from 'express'
import multer from 'multer'
import uploadController from '../controllers/uploadController.js'
import verifyJWT from '../middleware/verifyJWT.js'

// Configure multer for memory storage
const storage = multer.memoryStorage()
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

const router = express.Router()

// Upload image (profile or event banner)
router.post('/image', verifyJWT, upload.single('image'), uploadController.uploadImage)

// Delete image
router.delete('/image/:key', verifyJWT, uploadController.deleteImage)

export default router

// import express from 'express'
// import uploadController from '../controllers/uploadController.js'
// import verifyJWT from '../middleware/verifyJWT.js'

// const router = express.Router()

// // Upload image (profile or event banner)
// router.post('/image', verifyJWT, uploadController.uploadImage)

// // Delete image
// router.delete('/image/:key', verifyJWT, uploadController.deleteImage)

// export default router