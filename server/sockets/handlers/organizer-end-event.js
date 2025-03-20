import PostgresService from '../../services/postgresService.js'

const Event = new PostgresService('events')

const organizerEndEvent = async (io, socket, data) => {
  try {
    if (!socket.eventId || !socket.isOrganizer) {
      return socket.emit('error', { message: 'Unauthorized: Only organizers can end the event' })
    }
    
    // Update event status
    await Event.update(socket.eventId, { 
      event_is_active: false,
      networking_status: 'inactive',
      updated_at: new Date()
    })
    
    // Notify all attendees in the event
    io.to(`event:${socket.eventId}`).emit('event:ended', {
      message: 'This event has been ended by the organizer'
    })
    
    // Success response to organizer
    socket.emit('organizer:event-ended', { success: true })
    
  } catch (error) {
    console.error('Error in organizer:end-event handler:', error)
    socket.emit('error', { message: 'Failed to end event' })
  }
}

export { organizerEndEvent }

// const organizerEndEvent = async (io, socket, data) => {

// }

// export { organizerEndEvent }