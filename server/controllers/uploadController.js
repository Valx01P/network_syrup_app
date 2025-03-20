import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

// Create an S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
})

const uploadController = {
  uploadImage: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
      }
      
      const fileExtension = req.file.originalname.split('.').pop()
      const fileName = `${uuidv4()}.${fileExtension}`
      
      // Determine folder based on type
      const folder = req.body.type === 'profile' ? 'profiles' : 'events'
      const key = `${folder}/${fileName}`
      
      // Upload to S3
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype
      }
      
      await s3Client.send(new PutObjectCommand(params))
      
      // Generate file URL
      const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
      
      res.status(201).json({
        message: 'File uploaded successfully',
        url: fileUrl,
        key: key
      })
    } catch (error) {
      console.error('Error uploading file:', error)
      res.status(500).json({ message: 'Failed to upload file' })
    }
  },
  
  deleteImage: async (req, res) => {
    try {
      const { key } = req.params
      
      if (!key) {
        return res.status(400).json({ message: 'File key is required' })
      }
      
      // Delete from S3
      const params = {
        Bucket: process.env.AWS_S3_BUCKET,
        Key: key
      }
      
      await s3Client.send(new DeleteObjectCommand(params))
      
      res.status(200).json({ message: 'File deleted successfully' })
    } catch (error) {
      console.error('Error deleting file:', error)
      res.status(500).json({ message: 'Failed to delete file' })
    }
  }
}

export default uploadController

// const uploadController = {
//   async uploadImage(req, res) {

//   },
//   async deleteImage(req, res) {

//   }
// }

// export default uploadController