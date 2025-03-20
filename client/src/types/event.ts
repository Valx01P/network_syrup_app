export interface Event {
  id: string
  organizer_id: string
  event_name: string
  event_description: string
  event_location: string
  event_date: string
  event_time: string
  event_code: string
  event_image_banner_url?: string
  event_is_active: boolean
  networking_status: 'inactive' | 'one-on-one' | 'group'
  created_at: string
  updated_at: string
}

export interface EventState {
  currentEvent: Event | null
  userEvents: Event[]
  createdEvents: Event[]
  isLoading: boolean
  error: string | null
}