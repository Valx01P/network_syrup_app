import express from 'express'
import http from 'http'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
// Import your routes
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
// Import the socket setup function
import { initSockets } from './websockets/sockets.js'

dotenv.config()

const app = express()

app.use(cors(
  {
    origin: 'http://localhost:5173', // React app
    credentials: true
  }
))

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Hook up your routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)

// Create an HTTP server from the Express app
const server = http.createServer(app)

// Initialize Socket.IO on that server
initSockets(server)

// Start listening
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
