import PostgresService from '../../services/postgresService.js'

const Event = new PostgresService('events')

const organizerNetworkingEnd = async (io, socket, data) => {
  try {
    if (!socket.eventId || !socket.isOrganizer) {
      return socket.emit('error', { message: 'Unauthorized: Only organizers can end networking' })
    }
    
    // Update event status
    await Event.update(socket.eventId, { 
      networking_status: 'inactive',
      updated_at: new Date()
    })
    
    // Notify all attendees in the event
    io.to(`event:${socket.eventId}`).emit('networking:ended')
    
    // Success response to organizer
    socket.emit('organizer:networking-ended', { success: true })
    
  } catch (error) {
    console.error('Error in organizer:networking-end handler:', error)
    socket.emit('error', { message: 'Failed to end networking' })
  }
}

export { organizerNetworkingEnd }

// const organizerNetworkingEnd = async (socket, io, data) => {

// }

// export { organizerNetworkingEnd }