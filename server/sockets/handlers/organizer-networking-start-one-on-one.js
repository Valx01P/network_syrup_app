import PostgresService from '../../services/postgresService.js'

const Event = new PostgresService('events')
const Attendee = new PostgresService('attendees')

const organizerNetworkingStartOneOnOne = async (io, socket, data) => {
  try {
    if (!socket.eventId || !socket.isOrganizer) {
      return socket.emit('error', { message: 'Unauthorized: Only organizers can start networking' })
    }
    
    // Update event status
    await Event.update(socket.eventId, { 
      networking_status: 'one-on-one',
      updated_at: new Date()
    })
    
    // Get all present attendees
    const attendees = await Attendee.get_by_fields({
      event_id: socket.eventId,
      is_present: true
    })
    
    // Create pairs (this is a simple algorithm, can be improved)
    const pairs = createRandomPairs(attendees)
    
    // Notify all attendees in the event
    io.to(`event:${socket.eventId}`).emit('networking:started', {
      type: 'one-on-one',
      pairs
    })
    
    // Success response to organizer
    socket.emit('organizer:networking-started', { 
      success: true,
      type: 'one-on-one',
      pairs
    })
    
  } catch (error) {
    console.error('Error in organizer:networking-start-one-on-one handler:', error)
    socket.emit('error', { message: 'Failed to start one-on-one networking' })
  }
}

// Helper function to create random pairs
const createRandomPairs = (attendees) => {
  // Shuffle the attendees
  const shuffled = [...attendees].sort(() => 0.5 - Math.random())
  const pairs = []
  
  // Create pairs, leaving one person unpaired if odd number
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    pairs.push({
      pair_id: i/2,
      attendees: [
        {
          id: shuffled[i].id,
          name: `${shuffled[i].first_name} ${shuffled[i].last_name}`,
          profile_image_url: shuffled[i].profile_image_url
        },
        {
          id: shuffled[i+1].id,
          name: `${shuffled[i+1].first_name} ${shuffled[i+1].last_name}`,
          profile_image_url: shuffled[i+1].profile_image_url
        }
      ]
    })
  }
  
  // If odd number of attendees, add the last one to a random pair
  if (shuffled.length % 2 !== 0 && shuffled.length > 2) {
    const lastAttendee = shuffled[shuffled.length - 1]
    const randomPairIndex = Math.floor(Math.random() * pairs.length)
    
    pairs[randomPairIndex].attendees.push({
      id: lastAttendee.id,
      name: `${lastAttendee.first_name} ${lastAttendee.last_name}`,
      profile_image_url: lastAttendee.profile_image_url
    })
  }
  
  return pairs
}

export { organizerNetworkingStartOneOnOne }

// const organizerNetworkingStartOneOnOne = async (socket, io, data) => {

// }

// export { organizerNetworkingStartOneOnOne }