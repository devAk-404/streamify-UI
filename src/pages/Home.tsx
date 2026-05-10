import { useEffect, useState } from "react"
import { getVideos } from "../services/VideoApiService"
import VideoRow from "../components/VideoRow"
import type { Video } from "../types/video"
import { SECTION_MAP } from "../constants"

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getVideos()
        setVideos(data)
      } catch {
        console.error("Failed to load videos")
      } finally {
        setLoading(false)
      }
    }
    loadVideos()
  }, [])

  return (
    // h-full fills the `flex-1 min-h-0` slot in App.
    // overflow-y-auto means ONLY this div scrolls — the outer page is locked.
    // No background here — App.tsx owns the global background.
    <div className="h-full overflow-y-auto text-white px-6 md:px-10 py-10">

      {/* LOADING SKELETON */}
      {loading && (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="h-6 w-40 bg-gray-800 rounded mb-4 animate-pulse" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, j) => (
                  <div key={j} className="h-32 bg-gray-800 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIDEO ROWS */}
      {!loading && (
        <div className="space-y-12">
          {Object.keys(SECTION_MAP).map((sectionKey) => {
            const filteredVideos = videos.filter(
              (video) => video.sections?.includes(sectionKey)
            )
            if (filteredVideos.length === 0) return null
            return (
              <VideoRow
                key={sectionKey}
                title={SECTION_MAP[sectionKey]}
                videos={filteredVideos}
              />
            )
          })}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && videos.length === 0 && (
        <div className="text-center mt-20 text-gray-400">
          <p className="text-xl">No videos uploaded yet</p>
        </div>
      )}

    </div>
  )
}

export default Home