import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2'
import PostgresService from '../services/postgresService.js'

const User = new PostgresService('users')

export const configurePassport = () => {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`,
    scope: ['profile', 'email']
  }, 
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      const existingUsers = await User.get_by_field('google_id', profile.id)
      
      if (existingUsers.length > 0) {
        // User exists, update last_login
        const updatedUser = await User.update(existingUsers[0].id, {
          last_login: new Date()
        })
        return done(null, updatedUser)
      }
      
      // Check if email already exists with a different authentication method
      const emailUsers = await User.get_by_field('email', profile.emails[0].value)
      
      if (emailUsers.length > 0) {
        // User exists with same email but different auth method
        return done(null, false, { 
          message: 'Email already registered with a different authentication method' 
        })
      }
      
      // Create new user
      const newUser = await User.save({
        google_id: profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        profile_image_url: profile.photos[0]?.value || null,
        created_at: new Date(),
        last_login: new Date()
      })
      
      return done(null, newUser)
    } catch (error) {
      console.error('Error in Google strategy:', error)
      return done(error, null)
    }
  }))

  // LinkedIn OAuth Strategy
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URL}/api/auth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile'],
    state: true
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this LinkedIn ID
      const existingUsers = await User.get_by_field('linkedin_id', profile.id)
      
      if (existingUsers.length > 0) {
        // User exists, update last_login
        const updatedUser = await User.update(existingUsers[0].id, {
          last_login: new Date()
        })
        return done(null, updatedUser)
      }
      
      // Check if email already exists with a different authentication method
      const emailUsers = await User.get_by_field('email', profile.emails[0].value)
      
      if (emailUsers.length > 0) {
        // User exists with same email but different auth method
        return done(null, false, { 
          message: 'Email already registered with a different authentication method' 
        })
      }
      
      // Create new user
      const newUser = await User.save({
        linkedin_id: profile.id,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        profile_image_url: profile.photos[0]?.value || null,
        linkedin_url: profile._json?.publicProfileUrl || null,
        created_at: new Date(),
        last_login: new Date()
      })
      
      return done(null, newUser)
    } catch (error) {
      console.error('Error in LinkedIn strategy:', error)
      return done(error, null)
    }
  }))
}