import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css'

/* Pages */
/*

/ (where a user is at a kahoot like enter code screen)
/login (where a user can sign in or sign up with google or linkedin oauth)
/events (where a user can see all the events they attended and where they can make a new event)
/events/:id/live (where a user can see the live event)
/feedback (where a user can give feedback on the app)

*/

// have some protected routes using an outlet
// make most of the logic happen in the pages

// todo: reorganize the pages

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
