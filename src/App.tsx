import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Upload from "./pages/Upload"
import Watch from "./pages/Watch"
import { Toaster } from "react-hot-toast"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

function App() {
  return (
    // h-screen + overflow-hidden = outer container is LOCKED to viewport, never scrolls.
    // flex-col so Navbar (flex-shrink-0) stays pinned top and the page content below fills remaining height.
    <div className="h-screen overflow-hidden flex flex-col bg-[radial-gradient(circle_at_top,_#1a1a2e,_#000000_60%)] text-white">
      <Toaster position="top-right" />
      <BrowserRouter>

        {/* Navbar: fixed height, never pushed off screen */}
        <Navbar />

        {/* Route content fills remaining height.
            Each page is responsible for its own internal scroll via overflow-y-auto. */}
        <div className="flex-1 min-h-0">
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/upload"  element={<Upload />} />
            <Route path="/watch/:id" element={<Watch />} />
          </Routes>
        </div>

      </BrowserRouter>
    </div>
  )
}

export default App