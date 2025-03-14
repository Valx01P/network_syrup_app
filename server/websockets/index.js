import { Server } from 'socket.io';
import { setupAuthMiddleware } from '../middleware/authMiddleware.js';
import { setupEventMiddleware } from '../middleware/eventMiddleware.js';
import { setupUserMiddleware } from '../middleware/userMiddleware.js';


const initSockets = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })



  io.on('connection', (socket) => {
    console.log('A user connected')
  })
}

export { initSockets }