import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from 'react'
// import { AuthProvider } from "./context/AuthContext"
// import ProtectedRoute from "./components/ProtectedRoute"

// Lazy load all pages
const Home = lazy(() => import("./pages/Home"))
const NotFound = lazy(() => import("./pages/NotFound"))

// Event Pages
const Dashboard = lazy(() => import("./pages/Dashboard"))
const CreateEvent = lazy(() => import("./pages/CreateEvent"))
const UpdateEvent = lazy(() => import("./pages/UpdateEvent"))

// Event Participant Pages
const Join = lazy(() => import("./pages/Join"))
const Onboarding = lazy(() => import("./pages/Onboarding"))
const LoginSignup = lazy(() => import("./pages/LoginSignup"))
const OnboardingForm = lazy(() => import("./pages/OnboardingForm"))
const EventLobby = lazy(() => import("./pages/EventLobby"))
const EventNetworking = lazy(() => import("./pages/EventNetworking"))
const EventEnd = lazy(() => import("./pages/EventEnd"))


// Event Organizer Pages
const EventAdminLiveEvent = lazy(() => import("./pages/EventAdminLiveEvent"))
const EventAdminStatistics = lazy(() => import("./pages/EventAdminStatistics"))

// const Navbar = lazy(() => import("./components/Navbar"))

const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      {/* <AuthProvider> */}
        {/* <Navbar /> */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Join />} />
            <Route path="/home" element={<Home />} />


            {/* Protected Routes */}
            {/* <Route element={<ProtectedRoute requiredRole={["user", "guest"]} />}>
            
            </Route>

            <Route element={<ProtectedRoute requiredRole={["user"]} />}>

            </Route> */}

            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/event-admin/live" element={<EventAdminLiveEvent />} />
            <Route path="/event-admin/statistics" element={<EventAdminStatistics />} />
            <Route path="/event/end" element={<EventEnd />} />
            <Route path="/event/lobby" element={<EventLobby />} />
            <Route path="/event/networking" element={<EventNetworking />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/onboarding/auth" element={<LoginSignup />} />
            <Route path="/onboarding/form" element={<OnboardingForm />} />
            <Route path="/update-event" element={<UpdateEvent />} />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      {/* </AuthProvider> */}
    </BrowserRouter>
  )
}

export default App