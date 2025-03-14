/*
sockets
————————————————

handle-user-join

handle-user-leave

handle-user-onboarded

handle-organizer-join

handle-organizer-leave

organizer-networking-start-one-on-one

organizer-networking-start-group

organizer-networking-end

organizer-end-event

————————————————



http
————————————————

auth routes
 — google oauth
 — linkedin oauth

event routes
 — create event
 — update event
 — delete event
 — record attendance

 — get event attendees
 — get event attendees
 — get event details



————————————————



 database
————————————————

we want to store the events an organizer makes,
and the attendees that attend those events


Events {
 id
 id organizer
 str event_name
 str event_description
 str event_location
 str event_date
 str event_time
 str event_code
 str event_image_url // store in s3
}

Attendees {
 id
 bool guest
 id user?
 id event
 str first_name
 str last_name
 str email
 str intro
 str interests
 str linkedin_url
 str image_url // store in s3
}

Users {
  id
  str google_id
  str linkedin_id
  str first_name
  str last_name
  str email
  str intro
  str interests
  str linkedin_url
  str image_url // store in s3
}

Auth {

}



*/