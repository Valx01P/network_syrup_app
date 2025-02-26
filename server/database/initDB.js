import { pool } from './database.js'

const initDB = async () => {
    try {

    } catch (error) {
        console.error('Error initializing database:', error)
    }
}

/*
info we might need on the user table:
we'll be using google oauth or linkedin oauth
- uuid
- first name
- last name
- email
- icon_url
- created_at
*/
const createUserTableQuery = ``

/*
info we might need on the event table:
it's like a kahoot game
- uuid
- name
- description
- event_code (for joining the event)
- start_time (when the game starts)
- end_time (whenever the game ends by the host)
- created_at
- updated_at
- host_id (foreign key to user table)
*/
const createEventTableQuery = ``

/*
info we might need on the participant table:
the people who join the event, they can be a host or a player
players can signed in or not signed in, all players are onboarded
when they join a game and a post request makes them a participant
with some onboarding data form they fill out, if they are signed in
the data they fill out with that form can be reused in future events
otherwise if they are anonymous, they can still join the game
but they will have to fill out the form again in the future, they
are tracked with a cookie as a participant for this event
...things we might need for this table
- uuid
- event_id (foreign key to event table)
- first_name
- last_name
- description
- email
- linkedin_url
- signed_in (boolean)
- interests
- joined_at
*/
const createParticipantTableQuery = ``

/*
table for joining events and participants
this table will be used to track the participants in an event
- uuid
- event_id (foreign key to event table)
- participant_id (foreign key to participant table)
- joined_at
*/
const createJoinEventParticipantTableQuery = ``

initDB()