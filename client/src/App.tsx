import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Suspense, lazy } from 'react'

const Join = lazy(() => import("./pages/Join"))
// const Navbar = lazy(() => import("./components/Navbar"))
const NotFound = lazy(() => import("./pages/NotFound"))

const App = () => {

  return (
    <BrowserRouter>
      {/* <Navbar /> */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Join />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}


export default App