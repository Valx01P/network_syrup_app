import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from 'react'

const Home = lazy(() => import("./pages/Home"))
const Two = lazy(() => import("./pages/Two"))
// const Navbar = lazy(() => import("./components/Navbar"))
const NotFound = lazy(() => import("./pages/NotFound"))

const App = () => {

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/two" element={<Two />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}


export default App