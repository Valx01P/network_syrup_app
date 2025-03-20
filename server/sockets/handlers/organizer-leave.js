import PostgresService from '../../services/postgresService.js'

const Attendee = new PostgresService('attendees')

const handleOrganizerLeave = async (io, socket, data) => {
  try {
    if (!socket.eventId || !socket.attendeeId || !socket.isOrganizer) {
      return socket.emit('error', { message: 'You are not currently in an event as organizer' })
    }
    
    // Update attendee record
    await Attendee.update(socket.attendeeId, { is_present: false })
    
    // Notify room of organizer leaving
    socket.to(`event:${socket.eventId}`).emit('organizer:left', {
      attendeeId: socket.attendeeId
    })
    
    // Leave socket room
    socket.leave(`event:${socket.eventId}`)
    
    // Clear event data from socket
    socket.eventId = null
    socket.attendeeId = null
    socket.isOrganizer = false
    
    // Confirm to organizer
    socket.emit('organizer:left', { success: true })
    
  } catch (error) {
    console.error('Error in organizer:leave handler:', error)
    socket.emit('error', { message: 'Failed to leave event as organizer' })
  }
}

export { handleOrganizerLeave }

// const organizerLeave = async (socket, io, data) => {

// }

// export { organizerLeave }