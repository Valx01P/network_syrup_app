import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from 'react'

// Lazy load all pages
const CreateEvent = lazy(() => import("./pages/CreateEvent"))
const Dashboard = lazy(() => import("./pages/Dashboard"))
const EventAdminLiveEvent = lazy(() => import("./pages/EventAdminLiveEvent"))
const EventAdminStatistics = lazy(() => import("./pages/EventAdminStatistics"))
const EventEnd = lazy(() => import("./pages/EventEnd"))
const EventLobby = lazy(() => import("./pages/EventLobby"))
const EventNetworking = lazy(() => import("./pages/EventNetworking"))
const Home = lazy(() => import("./pages/Home"))
const Join = lazy(() => import("./pages/Join"))
const NotFound = lazy(() => import("./pages/NotFound"))
const Onboarding = lazy(() => import("./pages/Onboarding"))
const OnboardingAuth = lazy(() => import("./pages/OnboardingAuth"))
const OnboardingForm = lazy(() => import("./pages/OnboardingForm"))
const UpdateEvent = lazy(() => import("./pages/UpdateEvent"))

// const Navbar = lazy(() => import("./components/Navbar"))

const App = () => {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="/home" element={<Home />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/event-admin/live" element={<EventAdminLiveEvent />} />
          <Route path="/event-admin/statistics" element={<EventAdminStatistics />} />
          <Route path="/event/end" element={<EventEnd />} />
          <Route path="/event/lobby" element={<EventLobby />} />
          <Route path="/event/networking" element={<EventNetworking />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/auth" element={<OnboardingAuth />} />
          <Route path="/onboarding/form" element={<OnboardingForm />} />
          <Route path="/update-event" element={<UpdateEvent />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}

export default App