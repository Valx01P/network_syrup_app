import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'
import { SocketState } from '../types/socket'
import { NetworkingSession } from '../types/networking'

interface SocketStore extends SocketState {
  connect: (token?: string) => void
  disconnect: () => void
  joinEvent: (eventCode: string) => void
  leaveEvent: () => void
  onboardUser: (userData: any) => void
  organizerJoin: (eventId: string) => void
  organizerLeave: () => void
  startOneOnOneNetworking: () => void
  startGroupNetworking: (groupSize?: number) => void
  endNetworking: () => void
  endEvent: () => void
  onUserJoined: (callback: (data: any) => void) => void
  onUserLeft: (callback: (data: any) => void) => void
  onNetworkingStarted: (callback: (data: NetworkingSession) => void) => void
  onNetworkingEnded: (callback: () => void) => void
  onEventEnded: (callback: () => void) => void
  onError: (callback: (error: any) => void) => void
}

const initialState: SocketState = {
  isConnected: false,
  socket: null,
  error: null
}

export const useSocketStore = create<SocketStore>((set, get) => ({
  ...initialState,
  
  connect: (token) => {
    try {
      const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000', {
        auth: { token },
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })
      
      socket.on('connect', () => {
        set({ isConnected: true, error: null })
      })
      
      socket.on('disconnect', () => {
        set({ isConnected: false })
      })
      
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        set({ error: 'Failed to connect to server' })
      })
      
      set({ socket })
    } catch (error) {
      console.error('Socket initialization error:', error)
      set({ error: 'Failed to initialize socket connection' })
    }
  },
  
  disconnect: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },
  
  joinEvent: (eventCode) => {
    const { socket } = get()
    if (socket) {
      socket.emit('user:join', { eventCode })
    }
  },
  
  leaveEvent: () => {
    const { socket } = get()
    if (socket) {
      socket.emit('user:leave')
    }
  },
  
  onboardUser: (userData) => {
    const { socket } = get()
    if (socket) {
      socket.emit('user:onboarded', userData)
    }
  },
  
  organizerJoin: (eventId) => {
    const { socket } = get()
    if (socket) {
      socket.emit('organizer:join', { eventId })
    }
  },
  
  organizerLeave: () => {
    const { socket } = get()
    if (socket) {
      socket.emit('organizer:leave')
    }
  },
  
  startOneOnOneNetworking: () => {
    const { socket } = get()
    if (socket) {
      socket.emit('organizer:networking-start-one-on-one')
    }
  },
  
  startGroupNetworking: (groupSize = 4) => {
    const { socket } = get()
    if (socket) {
      socket.emit('organizer:networking-start-group', { groupSize })
    }
  },
  
  endNetworking: () => {
    const { socket } = get()
    if (socket) {
      socket.emit('organizer:networking-end')
    }
  },
  
  endEvent: () => {
    const { socket } = get()
    if (socket) {
      socket.emit('organizer:end-event')
    }
  },
  
  onUserJoined: (callback) => {
    const { socket } = get()
    if (socket) {
      socket.on('user:joined', callback)
    }
  },
  
  onUserLeft: (callback) => {
    const { socket } = get()
    if (socket) {
      socket.on('user:left', callback)
    }
  },
  
  onNetworkingStarted: (callback) => {
    const { socket } = get()
    if (socket) {
      socket.on('networking:started', callback)
    }
  },
  
  onNetworkingEnded: (callback) => {
    const { socket } = get()
    if (socket) {
      socket.on('networking:ended', callback)
    }
  },
  
  onEventEnded: (callback) => {
    const { socket } = get()
    if (socket) {
      socket.on('event:ended', callback)
    }
  },
  
  onError: (callback) => {
    const { socket } = get()
    if (socket) {
      socket.on('error', callback)
    }
  }
}))