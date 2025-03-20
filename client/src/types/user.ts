export interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  intro?: string
  interests?: string
  linkedin_url?: string
  profile_image_url?: string
}

export interface UserState {
  currentUser: User | null
  isLoading: boolean
  error: string | null
}
