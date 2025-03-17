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
GET — linkedin oauth login
GET — linkedin oauth callback
GET — google oauth login
GET — google oauth callback
POST — refresh 
POST — logout 


event routes
GET — get event
POST — create event
// POST - join event (user) (after onboarded (records the attendence as well))
// ^^ might tell the websocket you are joining
PUT — update event (organizer)
DELETE — delete event (organizer)


upload routes
POST — upload image
DELETE — delete image


user routes
PUT — update user
GET - get user
DELETE - delete user


attendee routes
POST - create attendee (when user/guest joins event (after onboarded))
GET — get attendee details
GET - get all attendees for event
GET - get all events for user
PUT — update attendee details 

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
 str event_image_banner_url // store in s3
 date created_at
 date updated_at
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
 str profile_image_url // store in s3
}

Users {
  id
  str google_id?
  str linkedin_id?
  str first_name
  str last_name
  str email
  str intro
  str interests
  str linkedin_url
  str profile_image_url // store in s3
  date created_at
}

Auth {

}




————————————————

This is app if a networking event app where people 
can go on the app and join events with a 6 digit code,
once they join these events they will be onboarded and
depending on if they are logged in or not to the app
(which login / signup is done through google or linkedin oauth)
then they will either have this onboarding data be stored in
a guest account or their user account, if it's in their user
account this is useful because on the frontend it can automatically
fill in this onboarding form for user events, but guest account details
are saved in the database as well as users, and are not deleted after the
event as after the event, the creators or rather organizer of the event
may want to see who came or the users may want to see who they met at the event.
Events are created by one organizer and they can have multiple attendees.
Events work with websockets so that the organizer can start networking
events and end them, and attendees can join and leave the event.
The organizer can start one-on-one networking events or group networking events
where users can see each other's specific details and connect with each other.
If a user suddenly leaves then of course they will be disconnected from the event
and the event will be updated to show that they left. The organizer can end the event
and once the event is ended then the event will be updated to show that it has ended
and the attendees will be disconnected from the event. There is a mix of http and
sockets going on as we want much of what is done to be saved in the database
and we want to be able to see this data in real time on the frontend. For example
we may want to save all the users and guests that joined the event when it was live
(if it's not started by the organizer you can't join) and we may want to save all the
users and guests that left the event when it was live, but we don't want to have the
attendees that left the event to be able to see the other attendees that are still in
the event since they won't be able to interact with them in person.

*/
