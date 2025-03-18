import passport from 'passport'
import jwt from 'jsonwebtoken'
import generateTokens from '../utils/generateTokens.js'
import PostgresService from '../services/postgresService.js'

const User = new PostgresService('users')

const authController = {
  // LinkedIn OAuth routes
  linkedinLogin: (req, res, next) => {
    passport.authenticate('linkedin')(req, res, next)
  },
  
  linkedinCallback: (req, res, next) => {
    passport.authenticate('linkedin', { session: false }, async (err, user, info) => {
      if (err) {
        console.error('LinkedIn auth error:', err)
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Authentication failed')}`)
      }
      
      if (!user) {
        const message = info?.message || 'Authentication failed'
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(message)}`)
      }
      
      try {
        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user)
        
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        
        // Redirect to client with access token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`)
      } catch (error) {
        console.error('Token generation error:', error)
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Failed to generate authentication tokens')}`)
      }
    })(req, res, next)
  },
  
  // Google OAuth routes
  googleLogin: (req, res, next) => {
    passport.authenticate('google')(req, res, next)
  },
  
  googleCallback: (req, res, next) => {
    passport.authenticate('google', { session: false }, async (err, user, info) => {
      if (err) {
        console.error('Google auth error:', err)
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Authentication failed')}`)
      }
      
      if (!user) {
        const message = info?.message || 'Authentication failed'
        return res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent(message)}`)
      }
      
      try {
        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(user)
        
        // Set refresh token as HTTP-only cookie
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })
        
        // Redirect to client with access token
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${accessToken}`)
      } catch (error) {
        console.error('Token generation error:', error)
        res.redirect(`${process.env.FRONTEND_URL}/auth/error?message=${encodeURIComponent('Failed to generate authentication tokens')}`)
      }
    })(req, res, next)
  },
  
  // Token refresh endpoint
  refresh: async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token not found' })
    }
    
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
      
      if (decoded.type !== 'refresh') {
        return res.status(401).json({ message: 'Invalid token type' })
      }
      
      // Get user
      const user = await User.get_by_id(decoded.userId)
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      
      // Generate new tokens
      const tokens = await generateTokens(user)
      
      // Set new refresh token
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      })
      
      // Return new access token
      return res.json({ accessToken: tokens.accessToken })
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Refresh token expired' })
      }
      
      console.error('Token refresh error:', error)
      return res.status(500).json({ message: 'Failed to refresh token' })
    }
  },
  
  // Logout endpoint
  logout: (req, res) => {
    res.clearCookie('refreshToken')
    return res.json({ message: 'Logged out successfully' })
  }
}

export default authController