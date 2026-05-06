import videojs from "video.js"
import "video.js/dist/video-js.css"
import { useEffect, useRef } from "react"

type Props = {
    src: string
    title?: string
    description?: string
    createdAt?: string
    rating?: string
    genre?: string
    duration?: string
}

const VideoPlayer = ({
    src,
    title,
    description,
    createdAt,
    rating,
    genre,
    duration
}: Props) => {

    const videoRef = useRef<HTMLVideoElement | null>(null)
    const playerRef = useRef<any>(null)

    useEffect(() => {

        let rafId: number

        const init = () => {

            const videoElement = videoRef.current

            if (!videoElement) {
                rafId = requestAnimationFrame(init)
                return
            }

            // Dispose old player
            if (playerRef.current) {
                playerRef.current.dispose()
                playerRef.current = null
            }

            playerRef.current = videojs(videoElement, {
                controls: true,
                autoplay: true,
                muted: true,
                preload: "auto",
                sources: [
                    {
                        src,
                        type: "application/x-mpegURL"
                    }
                ]
            })

            // REMOVE existing overlay if present
            const existing = playerRef.current.el().querySelector(".custom-overlay")
            if (existing) existing.remove()

            const overlay = document.createElement("div")
            overlay.className = "custom-overlay hidden"

            overlay.innerHTML = `
            <div class="overlay-content">

                <h1 class="overlay-title">
                ${title || ""}
                </h1>

                <div class="overlay-meta">
                ${rating ? `<span class="badge rating">${rating}</span>` : ""}
                ${createdAt ? `<span>${new Date(createdAt).getFullYear()}</span>` : ""}
                ${genre ? `<span>${genre}</span>` : ""}
                ${duration ? `<span>${duration}</span>` : ""}
                <span class="badge quality">HD</span>
                </div>

                <p class="overlay-desc">
                ${description || ""}
                </p>

            </div>
            `

            playerRef.current.el().appendChild(overlay)

            let hideTimeout: any

            const showOverlay = () => {
                overlay.classList.remove("hidden")

                clearTimeout(hideTimeout)

                hideTimeout = setTimeout(() => {
                    if (!playerRef.current.paused()) {
                        overlay.classList.add("hidden")
                    }
                }, 2000)
            }

            // Show on mouse move
            playerRef.current.el().addEventListener("mousemove", showOverlay)

            // Show on pause
            playerRef.current.on("pause", () => {
                overlay.classList.remove("hidden")
            })

            // Hide on play
            playerRef.current.on("play", () => {
                overlay.classList.add("hidden")
            })

        }

        rafId = requestAnimationFrame(init)

        return () => {
            cancelAnimationFrame(rafId)

            if (playerRef.current) {
                playerRef.current.dispose()
                playerRef.current = null
            }
        }

    }, [src])

    return (
        <div className="w-full h-full relative bg-black overflow-visible">
            <video
                ref={videoRef}
                className="video-js vjs-big-play-centered w-full h-full"
            />

            {/* <div className="absolute bottom-12 left-12 max-w-2xl z-50 pointer-events-none">

                <h1 className="text-4xl font-semibold text-white drop-shadow-lg">
                    {title}
                </h1>

                {description && (
                    <p className="text-gray-300 mt-2 text-lg">
                        {description}
                    </p>
                )}

                {createdAt && (
                    <p className="text-gray-400 mt-1 text-sm">
                        {new Date(createdAt).toLocaleDateString()}
                    </p>
                )}

            </div> */}
        </div>
    )
}

export default VideoPlayer