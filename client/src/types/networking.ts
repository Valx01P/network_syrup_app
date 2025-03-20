export interface NetworkAttendee {
  id: string
  name: string
  profile_image_url?: string
}

export interface Pair {
  pair_id: number
  attendees: NetworkAttendee[]
}

export interface Group {
  group_id: number
  attendees: NetworkAttendee[]
}

export interface NetworkingSession {
  type: 'one-on-one' | 'group'
  pairs?: Pair[]
  groups?: Group[]
}