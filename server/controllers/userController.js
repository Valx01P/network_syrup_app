import PostgresService from '../services/postgresService.js'
import verifyOwnership from '../utils/verifyOwnership.js'

const User = new PostgresService('users')
const Event = new PostgresService('events')
const Attendee = new PostgresService('attendees')

const userController = {
  getMe: async (req, res) => {
    try {
      const userId = req.jwt_user.userId
      const user = await User.get_by_id(userId)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Remove sensitive fields before sending
      delete user.google_id
      delete user.linkedin_id

      res.status(200).json(user)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      res.status(500).json({ message: 'Failed to fetch user profile' })
    }
  },

  updateMe: async (req, res) => {
    try {
      const userId = req.jwt_user.userId
      const user = await User.get_by_id(userId)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Fields that can be updated
      const allowedFields = ['first_name', 'last_name', 'intro', 'interests', 'linkedin_url', 'profile_image_url']
      const updateData = {}

      // Filter request body to only include allowed fields
      allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field]
        }
      })

      // Add updated_at timestamp
      updateData.updated_at = new Date()

      const updatedUser = await User.update(userId, updateData)

      // Remove sensitive fields before sending
      delete updatedUser.google_id
      delete updatedUser.linkedin_id

      res.status(200).json(updatedUser)
    } catch (error) {
      console.error('Error updating user profile:', error)
      res.status(500).json({ message: 'Failed to update user profile' })
    }
  },

  deleteMe: async (req, res) => {
    try {
      const userId = req.jwt_user.userId
      const deletedUser = await User.delete(userId)

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' })
      }

      res.clearCookie('refreshToken')
      res.status(200).json({ message: 'Account deleted successfully' })
    } catch (error) {
      console.error('Error deleting user account:', error)
      res.status(500).json({ message: 'Failed to delete user account' })
    }
  },

  getUserById: async (req, res) => {
    try {
      const { id } = req.params
      const user = await User.get_by_id(id)

      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // For public profile, only return non-sensitive info
      const publicUser = {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        intro: user.intro,
        interests: user.interests,
        linkedin_url: user.linkedin_url,
        profile_image_url: user.profile_image_url
      }

      res.status(200).json(publicUser)
    } catch (error) {
      console.error('Error fetching user by ID:', error)
      res.status(500).json({ message: 'Failed to fetch user' })
    }
  },

  // TODO: can be optimized in the future
  getUserEvents: async (req, res) => {
    try {
      const userId = req.jwt_user.userId
      
      // Get all attendees for this user
      const attendees = await Attendee.get_by_field('user_id', userId)
      
      if (!attendees.length) {
        return res.status(200).json([])
      }
      
      // Get all event IDs
      const eventIds = attendees.map(attendee => attendee.event_id)
      
      // Get event details for each event
      const events = []
      for (const eventId of eventIds) {
        const event = await Event.get_by_id(eventId)
        if (event) {
          events.push(event)
        }
      }
      
      res.status(200).json(events)
    } catch (error) {
      console.error('Error fetching user attended events:', error)
      res.status(500).json({ message: 'Failed to fetch attended events' })
    }
  },

  getUserCreatedEvents: async (req, res) => {
    try {
      const userId = req.jwt_user.userId
      
      // Get all events created by this user
      const events = await Event.get_by_field('organizer_id', userId)
      
      res.status(200).json(events)
    } catch (error) {
      console.error('Error fetching user created events:', error)
      res.status(500).json({ message: 'Failed to fetch created events' })
    }
  }
}

export default userController

// const userController = {
//   async getMe(req, res) {

//   },
//   async updateMe(req, res) {

//   },
//   async deleteMe(req, res) {

//   },
//   async getUserById(req, res) {

//   },
//   async getUserPastAttendedEvents(req, res) {

//   },
//   async getUserCreatedEvents(req, res) {

//   }
// }

// export default userController