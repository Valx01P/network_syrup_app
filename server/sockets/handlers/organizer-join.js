import PostgresService from '../../services/postgresService.js'

const Event = new PostgresService('events')
const Attendee = new PostgresService('attendees')

const handleOrganizerJoin = async (io, socket, data) => {
  try {
    const { eventId } = data
    
    if (!eventId) {
      return socket.emit('error', { message: 'Event ID is required' })
    }
    
    // Verify user is authenticated
    if (!socket.user.isAuthenticated) {
      return socket.emit('error', { message: 'Authentication required' })
    }
    
    // Get event
    const event = await Event.get_by_id(eventId)
    
    if (!event) {
      return socket.emit('error', { message: 'Event not found' })
    }
    
    // Verify user is the organizer
    if (event.organizer_id !== socket.user.id) {
      return socket.emit('error', { message: 'Only the organizer can join as organizer' })
    }
    
    // Store event info on socket
    socket.eventId = event.id
    socket.isOrganizer = true
    
    // Join the event room
    socket.join(`event:${event.id}`)
    
    // Check if organizer is already an attendee
    const attendees = await Attendee.get_by_fields({
      user_id: socket.user.id,
      event_id: event.id
    })
    
    let attendee
    
    if (attendees.length > 0) {
      // Update existing attendee
      attendee = attendees[0]
      socket.attendeeId = attendee.id
      
      if (!attendee.is_present) {
        await Attendee.update(attendee.id, { is_present: true })
      }
    } else {
      // Create organizer attendee record
      const user = await User.get_by_id(socket.user.id)
      
      const attendeeData = {
        guest: false,
        user_id: socket.user.id,
        event_id: event.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        intro: user.intro || '',
        interests: user.interests || '',
        linkedin_url: user.linkedin_url || '',
        profile_image_url: user.profile_image_url || '',
        is_present: true,
        joined_at: new Date()
      }
      
      attendee = await Attendee.save(attendeeData)
      socket.attendeeId = attendee.id
    }
    
    // Notify room that organizer joined
    socket.to(`event:${event.id}`).emit('organizer:joined', {
      attendeeId: attendee.id,
      name: `${attendee.first_name} ${attendee.last_name}`
    })
    
    // Get current attendees
    const currentAttendees = await Attendee.get_by_fields({
      event_id: event.id,
      is_present: true
    })
    
    // Send event details and attendees to organizer
    socket.emit('organizer:joined', {
      success: true,
      event,
      attendee,
      currentAttendees
    })
    
  } catch (error) {
    console.error('Error in organizer:join handler:', error)
    socket.emit('error', { message: 'Failed to join as organizer' })
  }
}

export { handleOrganizerJoin }

// const organizerJoin = async (socket, io, data) => {

// }

// export { organizerJoin }