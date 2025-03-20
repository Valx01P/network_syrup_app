```js
/*

here's a walkthrough of how the frontend would work

a user would hit our root of the site, which is our Join page where you can put in a code to find an
event, and then you'd get a preview of that event before confirming it's the correct one, JoinConfirm,
from there you go to the Onboarding page and get the option to continue as a Guest or make an account,
assuming you aren't signed in, if you are, you'd just skip to the OnboardingForm page, which asks
you basic questions for the event which can be automatically filled if you've already done it before
and then you'd only have to confirm, or you can edit it if you want and it will update on your
user, and once you submit that OnboardingForm it will create an attendee in our database for that
event and assosciate it with your userid, now going back, if you weren't logged in, then you can
make a user account with google or linkedin oauth (LoginSignup) and then after that you'd go to the
onboarding page or alternatively you could continue as a guest and you don't have to do any auth,
you'll simply get an attendee created in the database with the information you put in and then we'd
likely give you some simple short auth for that event that gets saved in localstorage, a lot of
things will be kept in localstorage for persistence, and for most of these parts of this joining
an event, etc, you can usually have the option to go back to the previous part of the process,
so persisting data is key to ensure that we don't lose any when moving from ui parts and so
we can ensure we can go back and forth in this process, after onboarding, which by the way, on the
onboarding form there is a camera component which lets you take a picture on the web and this is
what we'll be uploading to the backend to s3 and then getting the url for that to then make that
post request for an attendee with this image url link or something similar, aftwards when the
event starts and all this socket stuff starts going on we'll have a bunch of routes to ensure
a seamless networking experience for the event attendees and the organizers who will get to
control how networking is setup, and the attendees will just be seeing different attendee
info as this app is to help facilitate and streamline in person networking sessions and
the one on one or groups are just to show people who they are networking with, while the
organizers can randomize this with our backend functionality and simply decide if networking
will be with one on one people or groups, this info will be sent from the backend to show
who will be with who and the frontend would likely filter the list of attendees to show attendees
only the people they should be networking with and now you can see where the profile pictures
would be useful as now people can find each other based on the event picture they took, and
all the live event stuff will be done with websockets to ensure organizers can control the
event in real time and display changes to users as well as many other necessities websockets
will be useful for in tracking and sharing

users who have accounts should be able to make events and edit the events they made as well
as see the previous events they've attended or created in the Dashboard, ideally we also want
to add a Navbar across the Home page, Dashboard, and Event Admin pages and Event update and
create pages, for easy navigation for event organizers, the Event End, Lobby, Networking and
Waiting pages are for live events and for attendees, zustand will be used for global state,
when a user profile is clicked a side panel might open with their info, typescript will be
used to ensure maintainable and self documenting code, we will use axios as the api layer
to our backend and interceptors to ensure automated access and refresh token handling
for auth, we will have a ProtectedRoute component to act as a parent for protected routes,
some routes must only be accessible by who owns them, like a route for updating an event
must only be accessible to that event owner, while a route to make an event must only
be available to anyone with an account, while a route for a live game must only be
accessible by an attendee or something similar


*/
```