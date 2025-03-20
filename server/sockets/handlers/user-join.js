import PostgresService from '../../services/postgresService.js'

const Event = new PostgresService('events')
const Attendee = new PostgresService('attendees')

const handleUserJoin = async (io, socket, data) => {
  try {
    const { eventCode } = data
    
    if (!eventCode) {
      return socket.emit('error', { message: 'Event code is required' })
    }
    
    // Find event by code
    const events = await Event.get_by_field('event_code', eventCode)
    
    if (events.length === 0) {
      return socket.emit('error', { message: 'Event not found' })
    }
    
    const event = events[0]
    
    // Check if event is active
    if (!event.event_is_active) {
      return socket.emit('error', { message: 'Event is not currently active' })
    }
    
    // Store event info on socket
    socket.eventId = event.id
    
    // Join the event room
    socket.join(`event:${event.id}`)
    
    // If authenticated user, check if they are already an attendee
    if (socket.user.isAuthenticated) {
      const attendees = await Attendee.get_by_fields({
        user_id: socket.user.id,
        event_id: event.id
      })
      
      if (attendees.length > 0) {
        // User already registered, update presence
        const attendee = attendees[0]
        socket.attendeeId = attendee.id
        
        if (!attendee.is_present) {
          await Attendee.update(attendee.id, { is_present: true })
        }
        
        // Check if the user is the organizer
        socket.isOrganizer = event.organizer_id === socket.user.id
        
        // Notify room of user joining
        socket.to(`event:${event.id}`).emit('user:joined', {
          attendeeId: attendee.id,
          name: `${attendee.first_name} ${attendee.last_name}`,
          isOrganizer: socket.isOrganizer
        })
        
        // Send event details to user
        socket.emit('event:joined', { 
          event,
          attendee,
          isOrganizer: socket.isOrganizer,
          needsOnboarding: false
        })
        
        return
      }
    }
    
    // New user or guest, needs onboarding
    socket.emit('event:joined', { 
      event,
      isOrganizer: false,
      needsOnboarding: true
    })
    
  } catch (error) {
    console.error('Error in user:join handler:', error)
    socket.emit('error', { message: 'Failed to join event' })
  }
}

export { handleUserJoin }

// const userJoin = async (socket, io, data) => {

// }

// export { userJoin }