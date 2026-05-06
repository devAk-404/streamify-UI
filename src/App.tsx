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
    <>
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1a1a2e,_#000000_60%)] text-white">
      <Toaster position="top-right" />
      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/upload"
            element={<Upload />}
          />

          <Route
            path="/watch/:id"
            element={<Watch />}
          />

        </Routes>

      </BrowserRouter>
      </div>
    </>
  )
}

export default App