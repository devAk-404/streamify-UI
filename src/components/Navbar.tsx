import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

const Navbar = () => {

  const location = useLocation()

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const closeAll = () => {
    setMenuOpen(false)
    setSearchOpen(false)
  }

  const toggleMenu = () => {
    setMenuOpen(prev => !prev)
    setSearchOpen(false)
  }

  const toggleSearch = () => {
    setSearchOpen(prev => !prev)
    setMenuOpen(false)
  }

  // const linkStyle = (path: string) =>
  //   `block px-3 py-2 text-sm font-medium transition ${location.pathname === path
  //     ? "text-white"
  //     : "text-gray-300 hover:text-white"
  //   }`

  return (
    <>

      <div className="sticky top-0 z-50 flex justify-center px-4">
        <div
          className="
    w-full
    max-w-[95%] 
    sm:max-w-[640px]
    md:max-w-[908px]
    lg:max-w-[1300px]
    xl:max-w-[1500px]

    mx-auto

    backdrop-blur-xl
    bg-gradient-to-r from-indigo-950/80 via-purple-900/80 to-blue-950/80

    border border-white/10
    rounded-b-[1rem]

    shadow-[0_10px_40px_rgba(0,0,0,0.6)]

    px-4 sm:px-5 md:px-6 lg:px-8
    py-2 md:py-3
  "
        >
          {/* MAIN NAVBAR */}
          <div className="flex items-center justify-between w-full">

            <div className="min-[900px]:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md bg-white/10"
              >
                {menuOpen ? (
                  <span className="text-white text-xl">✕</span>
                ) : (
                  <div>
                    <div className="w-5 h-0.5 bg-white mb-1"></div>
                    <div className="w-5 h-0.5 bg-white mb-1"></div>
                    <div className="w-5 h-0.5 bg-white"></div>
                  </div>
                )}
              </button>
            </div>

            {/* LEFT: LOGO + NAV */}
            <div className="flex items-center gap-3 md:gap-4 min-w-0 scrollbar-hide max-w-full">

              {/* LOGO */}
              <Link
                to="/"
                className="text-lg md:text-2xl font-bold tracking-wide bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent"
              >
                STREAMBOX
              </Link>

              {/* NAV BUTTONS */}
              <div className="hidden min-[900px]:flex items-center ml-4 min-w-0 flex-1">

                <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide max-w-full bg-white/10 backdrop-blur-xl border border-white/10 rounded-full px-2 py-1 shadow-[0_8px_30px_rgba(0,0,0,0.4)]">

                  {[
                    { name: "Home", path: "/" },
                    { name: "Upload", path: "/upload" },
                  ].map((item) => {
                    const isActive = location.pathname === item.path

                    return (
                      <Link
                        key={item.name}
                        to={item.path}
                        className={`px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 text-xs sm:text-sm text-sm font-medium rounded-full transition-all duration-300 ${isActive
                          ? "bg-gray-500 text-black shadow-md"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {item.name}
                      </Link>
                    )
                  })}

                  {["Work", "Awards", "Team", "Prices", "Contact"].map((name) => (
                    <span
                      key={name}
                      className="px-2 sm:px-3 lg:px-4 py-1.5 lg:py-2 text-xs sm:text-sm text-sm font-medium rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer"
                    >
                      {name}
                    </span>
                  ))}

                </div>
              </div>

            </div>

            {/* RIGHT: SEARCH + PROFILE */}
            <div className="flex items-center gap-4">

              <button
                onClick={toggleSearch}
                className="
        w-10 h-10 flex items-center justify-center
        rounded-full bg-gray-500
        shadow-md hover:shadow-lg hover:scale-105
        transition-all duration-300
      "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </button>

              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold cursor-pointer">
                U
              </div>

            </div>

          </div>

          {/* MOBILE CENTER TITLE */}
          {/* <div className="absolute left-1/2 -translate-x-1/2 md:hidden">
            <span className="text-lg font-semibold text-white">
              STREAMBOX
            </span>
          </div> */}

          {/* RIGHT SIDE */}



        </div>

        {/* SEARCH BAR (ALL DEVICES ✅) */}


        {/* MOBILE MENU */}


      </div>

      <div className="w-full flex justify-center px-4 mt-2 min-[900px]:hidden">
        <div className="w-full max-w-screen-xl">

          <div
            className={`
        overflow-hidden transition-all duration-300
        ${menuOpen ? "max-h-40 opacity-100 translate-y-0 mt-4" : "max-h-0 opacity-0 -translate-y-2"}
      `}
          >
            <div
              className="
          flex flex-col gap-2

          px-3 py-3

          bg-gradient-to-br from-indigo-900/60 via-purple-900/60 to-blue-900/60
          backdrop-blur-xl

          border border-white/10
          rounded-2xl

          shadow-[0_10px_40px_rgba(0,0,0,0.6)]
        "
            >
              <Link
                to="/"
                onClick={closeAll}
                className={`
            px-4 py-2 rounded-xl text-sm font-medium
            transition-all duration-300
            ${location.pathname === "/"
                    ? "bg-white text-black shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/10"}
          `}
              >
                Home
              </Link>

              <Link
                to="/upload"
                onClick={closeAll}
                className={`
            px-4 py-2 rounded-xl text-sm font-medium
            transition-all duration-300
            ${location.pathname === "/upload"
                    ? "bg-white text-black shadow-md"
                    : "text-gray-300 hover:text-white hover:bg-white/10"}
          `}
              >
                Upload
              </Link>
            </div>
          </div>

        </div>
      </div>

      {searchOpen && (
        <div
          className="
          fixed inset-0 z-40
          bg-black/60
          transition-opacity duration-300
        "
          onClick={() => setSearchOpen(false)}
        />
      )}

      <div
        className={`
    fixed top-[70px] left-0 w-full z-50
    flex justify-center
    transition-all duration-300
    ${searchOpen ? "opacity-100 translate-y-0 mt-4" : "opacity-0 -translate-y-4 pointer-events-none"}
  `}
      >
        <div
          className="
    w-[92%] md:w-[60%] lg:w-[50%]

    bg-gradient-to-br from-[#0f172a]/95 via-[#1e293b]/95 to-[#020617]/95
    backdrop-blur-xl

    border border-white/10
    rounded-xl

    shadow-[0_20px_60px_rgba(0,0,0,0.8)]
    ring-1 ring-white/5

    px-6 py-6 mt-2
  "
        >

          <input
            type="text"
            placeholder="Search movies, shows..."
            className="
        w-full

        bg-transparent
        border border-white/10
        rounded-lg

        px-5 py-3 text-base
        text-white placeholder-gray-400

        outline-none
        ring-2 ring-purple-500
        border-transparent

        transition-all duration-300
      "
          />

        </div>
      </div>
    </>

  )
}

export default Navbar