
const setupAuthMiddleware = (io) => {
  io.use((socket, next) => {
    // Get token from handshake auth object
    const token = socket.handshake.auth.token;
    
    if (!token) {
      // Allow connection even without token for this example
      // In a real app, you might want to authenticate properly
      socket.user = { id: socket.id, isAuthenticated: false };
      return next();
    }
    
    // Validate token (example implementation)
    if (validateToken(token)) {
      // Attach user data to socket for use in handlers
      socket.user = { 
        id: getUserIdFromToken(token), 
        isAuthenticated: true 
      };
      return next();
    }
    
    return next(new Error('Authentication error'));
  });
}

// Example helper functions
function validateToken(token) {
  // In a real app, validate JWT or session token
  return token.length > 10; // Simple example validation
}

function getUserIdFromToken(token) {
  // In a real app, decode JWT or query database
  return 'user_' + token.substring(0, 5);
}

export { setupAuthMiddleware }