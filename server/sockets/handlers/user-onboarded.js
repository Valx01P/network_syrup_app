import PostgresService from '../../services/postgresService.js'

const Event = new PostgresService('events')
const Attendee = new PostgresService('attendees')
const User = new PostgresService('users')

const handleUserOnboarded = async (io, socket, data) => {
  try {
    if (!socket.eventId) {
      return socket.emit('error', { message: 'You must join an event first' })
    }
    
    const { firstName, lastName, email, intro, interests, linkedinUrl, profileImageUrl } = data
    
    // Basic validation
    if (!firstName || !lastName || !email) {
      return socket.emit('error', { message: 'Missing required fields' })
    }
    
    // Get event
    const event = await Event.get_by_id(socket.eventId)
    
    if (!event) {
      return socket.emit('error', { message: 'Event not found' })
    }
    
    // Prepare attendee data
    const attendeeData = {
      event_id: socket.eventId,
      first_name: firstName,
      last_name: lastName,
      email: email,
      intro: intro || '',
      interests: interests || '',
      linkedin_url: linkedinUrl || '',
      profile_image_url: profileImageUrl || '',
      is_present: true,
      joined_at: new Date()
    }
    
    // If user is authenticated, link to user account
    if (socket.user.isAuthenticated) {
      attendeeData.guest = false
      attendeeData.user_id = socket.user.id
      
      // Update user profile with provided data if fields are empty
      const user = await User.get_by_id(socket.user.id)
      
      if (user) {
        const updateData = {}
        
        if (!user.intro && intro) updateData.intro = intro
        if (!user.interests && interests) updateData.interests = interests
        if (!user.linkedin_url && linkedinUrl) updateData.linkedin_url = linkedinUrl
        if (!user.profile_image_url && profileImageUrl) updateData.profile_image_url = profileImageUrl
        
        if (Object.keys(updateData).length > 0) {
          await User.update(socket.user.id, updateData)
        }
      }
    } else {
      // Guest attendee
      attendeeData.guest = true
      attendeeData.user_id = null
    }
    
    // Create attendee record
    const attendee = await Attendee.save(attendeeData)
    
    // Store attendee ID on socket
    socket.attendeeId = attendee.id
    
    // Notify room of new attendee
    socket.to(`event:${socket.eventId}`).emit('user:joined', {
      attendeeId: attendee.id,
      name: `${attendee.first_name} ${attendee.last_name}`,
      isOrganizer: false
    })
    
    // Confirm onboarding to user
    socket.emit('user:onboarded', {
      success: true,
      attendee
    })
    
  } catch (error) {
    console.error('Error in user:onboarded handler:', error)
    socket.emit('error', { message: 'Failed to complete onboarding' })
  }
}

export { handleUserOnboarded }

// const userOnboarded = async (socket, io, data) => {

// }

// export { userOnboarded }