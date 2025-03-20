import PostgresService from '../../services/postgresService.js'

const Attendee = new PostgresService('attendees')

const handleUserLeave = async (io, socket, data) => {
  try {
    if (!socket.eventId || !socket.attendeeId) {
      return socket.emit('error', { message: 'You are not currently in an event' })
    }
    
    // Update attendee record
    await Attendee.update(socket.attendeeId, { is_present: false })
    
    // Notify room of user leaving
    socket.to(`event:${socket.eventId}`).emit('user:left', {
      attendeeId: socket.attendeeId
    })
    
    // Leave socket room
    socket.leave(`event:${socket.eventId}`)
    
    // Clear event data from socket
    socket.eventId = null
    socket.attendeeId = null
    socket.isOrganizer = false
    
    // Confirm to user
    socket.emit('user:left', { success: true })
    
  } catch (error) {
    console.error('Error in user:leave handler:', error)
    socket.emit('error', { message: 'Failed to leave event' })
  }
}

export { handleUserLeave }

// const userLeave = async (socket, io, data) => {

// }

// export { userLeave }