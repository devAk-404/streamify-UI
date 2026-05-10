import { useNavigate } from "react-router-dom"
import type { Video } from "../types/video"
import { useEffect, useRef, useState, useCallback } from "react"

// Minimum cards before enabling infinite cloning.
// With fewer cards than this, clones are visible at the same time as originals.
const MIN_FOR_LOOP = 7

// Triple-clone infinite carousel:
// Layout: [ clone-of-end | original | clone-of-start ]
// We start scrolled to the "original" section.
// When the user scrolls into a clone region, we silently teleport back
// to the matching real position — seamless, no flash.

const VideoRow = ({ title, videos }: { title: string; videos: Video[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef<{ x: number; scrollLeft: number } | null>(null)
  const isJumping = useRef(false)

  // Only clone when enough cards exist to stay off-screen
  const shouldLoop = videos.length >= MIN_FOR_LOOP
  const tripled = shouldLoop ? [...videos, ...videos, ...videos] : videos
  const setSize = videos.length

  // Helper: card width including gap
  const getCardW = useCallback(() => {
    const el = scrollRef.current
    if (!el) return 0
    const firstCard = el.children[0] as HTMLElement
    if (!firstCard) return 0
    const gap = parseFloat(getComputedStyle(el).gap) || 0
    return firstCard.offsetWidth + gap
  }, [])

  // Jump to middle set on mount — only needed when looping
  const initScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || !shouldLoop || setSize === 0) return
    const cardW = getCardW()
    if (cardW === 0) return
    el.scrollLeft = cardW * setSize
  }, [setSize, getCardW])

  useEffect(() => {
    const raf = requestAnimationFrame(initScroll)
    return () => cancelAnimationFrame(raf)
  }, [initScroll])

  // Infinite loop: silently teleport when entering clone zones (only when looping)
  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || !shouldLoop || isJumping.current || setSize === 0) return
    const cardW = getCardW()
    if (cardW === 0) return
    const setWidth = cardW * setSize
    const midStart = setWidth        // where the real set begins (after 1 clone set)
    const midEnd = setWidth * 2      // where the real set ends

    if (el.scrollLeft < midStart - 1) {
      isJumping.current = true
      el.scrollLeft += setWidth
      isJumping.current = false
    } else if (el.scrollLeft >= midEnd) {
      isJumping.current = true
      el.scrollLeft -= setWidth
      isJumping.current = false
    }
  }, [setSize, getCardW])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [onScroll])

  // Smooth scroll on button click
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.78
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" })
  }

  // Mouse drag-to-scroll (desktop)
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current
    if (!el) return
    dragStart.current = { x: e.clientX, scrollLeft: el.scrollLeft }
    setIsDragging(false)
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current) return
    const dx = e.clientX - dragStart.current.x
    if (Math.abs(dx) > 4) setIsDragging(true)
    if (scrollRef.current)
      scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx
  }
  const onMouseUp = () => { dragStart.current = null }

  return (
    <div className="mb-10 md:mb-14 select-none">
      {/* Row title */}
      <h2 className="
        text-sm md:text-lg font-semibold tracking-wide
        mb-2.5 md:mb-4 px-3 md:px-2
        text-white/90
      ">
        {title}
      </h2>

      {/* Slider wrapper */}
      <div className="relative group/row">

        {/* Left arrow — desktop only, shown on row hover */}
        <button
          onClick={() => scroll("left")}
          aria-label="Scroll left"
          className="
            hidden md:flex
            absolute left-0 top-0 bottom-0 z-30 w-14
            items-center justify-center
            bg-gradient-to-r from-black/90 via-black/60 to-transparent
            opacity-0 group-hover/row:opacity-100
            transition-opacity duration-300
            pointer-events-none group-hover/row:pointer-events-auto
          "
        >
          <span className="
            flex items-center justify-center
            w-9 h-9 rounded-full
            bg-white/15 backdrop-blur-sm border border-white/20
            text-white text-xl font-bold
            hover:bg-white/25 active:scale-95
            transition-all duration-200 shadow-lg
          ">‹</span>
        </button>

        {/* Right arrow — desktop only, shown on row hover */}
        <button
          onClick={() => scroll("right")}
          aria-label="Scroll right"
          className="
            hidden md:flex
            absolute right-0 top-0 bottom-0 z-30 w-14
            items-center justify-center
            bg-gradient-to-l from-black/90 via-black/60 to-transparent
            opacity-0 group-hover/row:opacity-100
            transition-opacity duration-300
            pointer-events-none group-hover/row:pointer-events-auto
          "
        >
          <span className="
            flex items-center justify-center
            w-9 h-9 rounded-full
            bg-white/15 backdrop-blur-sm border border-white/20
            text-white text-xl font-bold
            hover:bg-white/25 active:scale-95
            transition-all duration-200 shadow-lg
          ">›</span>
        </button>

        {/* Scrollable track
            NOTE: no `scroll-smooth` class here — the class enables smooth on ALL
            scroll events including our silent jump, which would cause a visible slide.
            We use scrollBy({ behavior: "smooth" }) only on button clicks. */}
        <div
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          className={`
            flex gap-2 md:gap-3
            overflow-x-auto
            px-3 md:px-2 pb-2
            ${isDragging ? "cursor-grabbing" : "cursor-default"}
          `}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          } as React.CSSProperties}
        >
          {tripled.map((video, i) => (
            <div
              key={`${video._id}-${i}`}
              className="flex-shrink-0 w-[42vw] min-w-[150px] max-w-[180px] md:w-[180px] xl:w-[200px]"
            >
              <VideoCard video={video} isDragging={isDragging} />
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

const VideoCard = ({ video, isDragging }: { video: Video; isDragging: boolean }) => {
  const navigate = useNavigate()
  const [imgLoaded, setImgLoaded] = useState(false)

  const handleClick = () => {
    if (!isDragging) navigate(`/watch/${video._id}?autoplay=true`)
  }

  return (
    <div
      onClick={handleClick}
      className="
        group/card relative cursor-pointer
        rounded-lg md:rounded-xl overflow-hidden
        bg-gray-900
        border border-white/[0.06]
        shadow-[0_4px_16px_rgba(0,0,0,0.5)]
        hover:shadow-[0_12px_40px_rgba(168,85,247,0.3)]
        hover:border-purple-500/30
        transition-all duration-300 ease-out
        md:hover:-translate-y-2 md:hover:scale-[1.03]
        active:scale-[0.97]
      "
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/2.8] md:aspect-[2/2.6] overflow-hidden bg-gray-800">

        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse" />
        )}

        <img
          src={video.thumbnail}
          alt={video.title}
          onLoad={() => setImgLoaded(true)}
          className={`
            w-full h-full object-cover
            transition-all duration-500
            group-hover/card:scale-105
            ${imgLoaded ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Hover gradient overlay */}
        <div className="
          absolute inset-0
          bg-gradient-to-t from-black/80 via-black/20 to-transparent
          opacity-0 group-hover/card:opacity-100
          transition-opacity duration-300
        " />

        {/* Play button */}
        <div className="
          absolute inset-0 flex items-center justify-center
          opacity-0 group-hover/card:opacity-100
          transition-all duration-300
        ">
          <div className="
            w-9 h-9 md:w-12 md:h-12 rounded-full
            bg-white/90 backdrop-blur-sm
            flex items-center justify-center
            shadow-[0_0_20px_rgba(168,85,247,0.6)]
            scale-75 group-hover/card:scale-100
            transition-transform duration-300
          ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 md:w-5 md:h-5 ml-0.5 text-black"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {/* Purple ring glow */}
        <div className="
          absolute inset-0 rounded-lg md:rounded-xl
          ring-1 ring-purple-500/0
          group-hover/card:ring-purple-500/40
          transition-all duration-300
          pointer-events-none
        " />

      </div>

      {/* Title */}
      <div className="px-2 py-2 md:px-3 md:py-2.5">
        <p className="
          text-[11px] md:text-[13px] font-medium
          leading-snug line-clamp-2
          text-white/80 group-hover/card:text-white
          transition-colors duration-200
        ">
          {video.title}
        </p>
      </div>

    </div>
  )
}

export default VideoRow