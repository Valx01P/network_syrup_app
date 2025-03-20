export interface AuthUser {
  id: string
  email: string
  first_name: string
  last_name: string
  intro?: string
  interests?: string
  linkedin_url?: string
  profile_image_url?: string
  created_at: string
  last_login: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isGuest: boolean
  error: string | null
  accessToken: string | null
}