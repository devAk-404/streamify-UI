import { useEffect, useState } from "react"
import { useParams, useLocation } from "react-router-dom"
import { getVideoById } from "../services/VideoApiService"
import VideoPlayer from "../components/VideoPlayer"
import type { Video } from "../types/video"
import { useNavigate } from "react-router-dom"


const Watch = () => {
    const navigate = useNavigate()

    const { id } = useParams()
    const location = useLocation()

    const [video, setVideo] = useState<Video | null>(null)

    const query = new URLSearchParams(location.search)
    const autoplay = query.get("autoplay") === "true"

    useEffect(() => {

        const loadVideo = async () => {

            if (!id) return

            const data = await getVideoById(id)
            setVideo(data)

        }

        loadVideo()

    }, [id])

    if (!video) return null

    return (

        <div className="bg-black text-white min-h-screen">

            {/* VIDEO SECTION */}
            <div className="relative w-full group">

                {/* PLAYER CONTAINER */}
                <div className="w-full aspect-video md:h-[85vh] md:aspect-auto overflow-visible">

                    <VideoPlayer
                        key={video._id}
                        src={video.streamUrl}
                        title={video.title}
                        description={video.description}
                        createdAt={video.createdAt}
                        rating={video.rating}
                        genre={video.genre}
                    />

                </div>

                {/* BACK BUTTON */}
                <button
                    onClick={() => navigate("/")}
                    className="
          absolute top-3 left-3 md:top-6 md:left-6 z-50
          flex items-center gap-2

          bg-black/50 backdrop-blur-md
          hover:bg-black/80

          text-white
          px-3 py-2 md:px-4 md:py-2

          rounded-full
          shadow-lg

          transition-all duration-300

          opacity-80 hover:opacity-100
        "
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 19l-7-7 7-7" />
                    </svg>

                    <span className="text-sm hidden sm:block">Back</span>
                </button>

            </div>

            {/* BELOW VIDEO INFO (mobile friendly) */}
            <div className="px-4 md:px-10 py-6 max-w-5xl mx-auto">

                <h1 className="text-xl md:text-3xl font-semibold">
                    {video.title}
                </h1>

                {/* META */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mt-3">

                    {video.rating && (
                        <span className="px-2 py-1 bg-white/10 rounded">
                            {video.rating}
                        </span>
                    )}

                    {video.createdAt && (
                        <span>
                            {new Date(video.createdAt).getFullYear()}
                        </span>
                    )}

                    {video.genre && (
                        <span>{video.genre}</span>
                    )}

                    <span className="px-2 py-1 bg-white/10 rounded">
                        HD
                    </span>

                </div>

                {/* DESCRIPTION */}
                {video.description && (
                    <p className="mt-4 text-gray-300 leading-relaxed text-sm md:text-base">
                        {video.description}
                    </p>
                )}

            </div>

        </div>
    )
}

export default Watch