import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AuthState, AuthUser } from '../types/auth'
import { userApi } from '../api/axiosApi'

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isGuest: false,
  error: null,
  accessToken: null
}

export const useAuthStore = create<AuthState & {
  setUser: (user: AuthUser) => void
  setAccessToken: (token: string) => void
  setGuest: (isGuest: boolean) => void
  fetchCurrentUser: () => Promise<void>
  logout: () => void
  clearError: () => void
}>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setUser: (user) => set({ 
        user, 
        isAuthenticated: true,
        isLoading: false,
        error: null
      }),
      
      setAccessToken: (token) => {
        localStorage.setItem('accessToken', token)
        set({ accessToken: token })
      },
      
      setGuest: (isGuest) => set({ isGuest }),
      
      fetchCurrentUser: async () => {
        set({ isLoading: true, error: null })
        
        try {
          const token = localStorage.getItem('accessToken')
          
          if (!token) {
            set({ 
              isLoading: false,
              isAuthenticated: false,
              user: null
            })
            return
          }
          
          const { data } = await userApi.getCurrentUser()
          
          set({ 
            user: data,
            isAuthenticated: true,
            isLoading: false,
            isGuest: false,
            error: null
          })
        } catch (error) {
          console.error('Error fetching user:', error)
          set({ 
            isLoading: false,
            error: 'Failed to fetch user profile',
            isAuthenticated: false,
            user: null
          })
        }
      },
      
      logout: () => {
        localStorage.removeItem('accessToken')
        set(initialState)
      },
      
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        accessToken: state.accessToken,
        isGuest: state.isGuest
      })
    }
  )
)