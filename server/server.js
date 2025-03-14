import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
// Import your routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import attendeeRoutes from './routes/attendeeRoutes.js'
// Import the socket setup function
import { initSockets } from './sockets/index.js'

dotenv.config()

const app = express()

// Create an HTTP server from the Express app
const httpServer = http.createServer(app)

// Define CORS options - use the same for both Express and Socket.IO
const corsOptions = {
  origin: 'http://localhost:5173', // React app
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Hook up your routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/attendees', attendeeRoutes)

// Initialize Socket.IO on that server
initSockets(httpServer, corsOptions)

// Start listening
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
