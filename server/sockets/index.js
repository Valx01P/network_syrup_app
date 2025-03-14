import { Server } from 'socket.io';
import { setupAuthMiddleware } from '../middleware/authMiddleware.js';
import { handleUserJoin } from './handlers/user-join.js';
import { handleUserLeave } from './handlers/user-leave.js';
import { handleUserOnboarded } from './handlers/user-onboarded.js';
import { handleOrganizerJoin } from './handlers/organizer-join.js';
import { handleOrganizerLeave } from './handlers/organizer-leave.js';
import { organizerNetworkingStartOneOnOne } from './handlers/organizer-networking-start-one-on-one.js';
import { organizerNetworkingStartGroup } from './handlers/organizer-networking-start-group.js';
import { organizerNetworkingEnd } from './handlers/organizer-networking-end.js';
import { organizerEndEvent } from './handlers/organizer-end-event.js';

const initSockets = (httpServer, corsOptions) => {
  const io = new Server(httpServer, {
    cors: corsOptions // Use the same CORS options as the Express app
  })

  io.use((socket, next) => {
    setupAuthMiddleware(socket, next);
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);
    
    // User event handlers
    socket.on('user:join', (data) => handleUserJoin(io, socket, data));
    socket.on('user:leave', (data) => handleUserLeave(io, socket, data));
    socket.on('user:onboarded', (data) => handleUserOnboarded(io, socket, data));
    
    // Organizer event handlers
    socket.on('organizer:join', (data) => handleOrganizerJoin(io, socket, data));
    socket.on('organizer:leave', (data) => handleOrganizerLeave(io, socket, data));
    socket.on('organizer:networking-start-one-on-one', (data) => 
      organizerNetworkingStartOneOnOne(io, socket, data));
    socket.on('organizer:networking-start-group', (data) => 
      organizerNetworkingStartGroup(io, socket, data));
    socket.on('organizer:networking-end', (data) => 
      organizerNetworkingEnd(io, socket, data));
    socket.on('organizer:end-event', (data) => 
      organizerEndEvent(io, socket, data));
    
    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

export { initSockets }