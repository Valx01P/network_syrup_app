idea -

I was thinking it would be like kahoot, on the frontend you put in a code for an event, then in that event you can make it such that it decides groups based on the total amount of people who entered the code, and how many groups you want, and then it randomly assigns you a group until they are filled up

alternatively you should have the option to have one on one networking and so you might have a mode where everyone just gets a number and you get randomly tagged with another person

the app might also let you put in a name, your linkedin, your interests, and a short description which can all act as an ice breaker and stream line networking

the app requires no logging in, but that could be an option, so the info entered is saved in the future and reused, it's a simple app, and it would have a way to manage the event based on groups or one on one networking and would likely let you collect data from people put in which could help with tracking and seeing who networked with who, possibly 
that's my rough idea at least, it would also have a cool roulette animation for you getting randomly assigned to someone to network with or a group to network with
people who make an event would need to login so they can manage it, perhaps
I think I'd just go with a simple react and node express full stack thing, with postgres as the db
and just make it responsive instead of an actual app, so everyone can access it from the web

---

- main
We will have a main page where a user can enter an event code to join an event

- event onboarding
After entering a code the user will be taken to an event onboarding where they
are asked to fill a form 
like page
where if they are signed in they will be optionally able to use their previous
info and if they aren't 



as user ->

main kahoot
takes you to onboarding, varies if you are or aren't logged in
waiting room can be used by organizers to describe the event
when the event is started by the organizer you are put into groups
or are paired with other people
when you are paired with another person for a one on one, then you see their name, description,
interests, and linkedin
when you are paired with a group you see all that info from everyone in the group

as organizer ->

main kahoot, you go to organizer's page
you can create a new networking event and decide the style, group networking or one on one networking
as people join your event you can decide how many groups you want, or you can have the app decide automatically
based on how many people are at the event, it will automatically try to make groups of 3 and 4 unless specified
otherwise, you should be able to decide how many groups of people you want and how many people inside each group
alternatively you can make it so that participants are networking one on one and so each participant will be given
a number or something and then be matched with another participant until the organizers reshuffle all of the participants so they match with other people, if there is an odd number of participants there will be one group
of 3 networking, we don't care if a user disconnects from a one on one or a group because they will be there in
person, they will just not be included in the next one / shuffle because they wont be in a room, so to continue
getting assigned they'd want to
an organizer can end the current networking for participants and take them back into the waiting room until a
new round of networking starts, or they can close the room for everyone if the event is over


Network syrup features:

Live Networking sessions
Resume generator
