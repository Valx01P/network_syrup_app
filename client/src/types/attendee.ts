export interface Attendee {
  id: string
  guest: boolean
  user_id?: string
  event_id: string
  first_name: string
  last_name: string
  email: string
  intro?: string
  interests?: string
  linkedin_url?: string
  profile_image_url?: string
  is_present: boolean
  joined_at: string
}

export interface AttendeeState {
  currentAttendee: Attendee | null
  eventAttendees: Attendee[]
  isLoading: boolean
  error: string | null
}