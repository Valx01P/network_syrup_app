import PostgresService from '../../services/postgresService.js'

const Event = new PostgresService('events')
const Attendee = new PostgresService('attendees')

const organizerNetworkingStartGroup = async (io, socket, data) => {
  try {
    if (!socket.eventId || !socket.isOrganizer) {
      return socket.emit('error', { message: 'Unauthorized: Only organizers can start networking' })
    }
    
    const { groupSize = 4 } = data
    
    // Update event status
    await Event.update(socket.eventId, { 
      networking_status: 'group',
      updated_at: new Date()
    })
    
    // Get all present attendees
    const attendees = await Attendee.get_by_fields({
      event_id: socket.eventId,
      is_present: true
    })
    
    // Create groups
    const groups = createRandomGroups(attendees, groupSize)
    
    // Notify all attendees in the event
    io.to(`event:${socket.eventId}`).emit('networking:started', {
      type: 'group',
      groups
    })
    
    // Success response to organizer
    socket.emit('organizer:networking-started', { 
      success: true,
      type: 'group',
      groups
    })
    
  } catch (error) {
    console.error('Error in organizer:networking-start-group handler:', error)
    socket.emit('error', { message: 'Failed to start group networking' })
  }
}

// Helper function to create random groups
const createRandomGroups = (attendees, groupSize) => {
  // Shuffle the attendees
  const shuffled = [...attendees].sort(() => 0.5 - Math.random())
  const groups = []
  
  // Calculate number of groups needed
  const numGroups = Math.ceil(shuffled.length / groupSize)
  
  // Create groups
  for (let i = 0; i < numGroups; i++) {
    const group = {
      group_id: i,
      attendees: []
    }
    
    // Fill each group with attendees
    const startIndex = i * groupSize
    const endIndex = Math.min(startIndex + groupSize, shuffled.length)
    
    for (let j = startIndex; j < endIndex; j++) {
      group.attendees.push({
        id: shuffled[j].id,
        name: `${shuffled[j].first_name} ${shuffled[j].last_name}`,
        profile_image_url: shuffled[j].profile_image_url
      })
    }
    
    groups.push(group)
  }
  
  // If last group has too few people, distribute them to other groups
  if (groups.length > 1 && groups[groups.length - 1].attendees.length < groupSize / 2) {
    const lastGroup = groups.pop()
    
    lastGroup.attendees.forEach((attendee, index) => {
      const targetGroupIndex = index % groups.length
      groups[targetGroupIndex].attendees.push(attendee)
    })
  }
  
  return groups
}

export { organizerNetworkingStartGroup }

// const organizerNetworkingStartGroup = async (socket, io, data) => {

// }

// export { organizerNetworkingStartGroup }