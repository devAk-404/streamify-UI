import Slider from "react-slick"
import { useNavigate } from "react-router-dom"
import type { Video } from "../types/video"
import { useEffect, useState } from "react";

const VideoRow = ({ title, videos }: { title: string, videos: Video[] }) => {


    const [screenWidth, setScreenWidth] = useState(0)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const update = () => {
            setScreenWidth(window.innerWidth)
            setMounted(true)
        }

        update()

        window.addEventListener("resize", update)
        return () => window.removeEventListener("resize", update)
    }, [])

    const navigate = useNavigate();

    const NextArrow = ({ onClick }: any) => (
        <div
            onClick={onClick}
            className="
      absolute right-0 top-1/2 -translate-y-1/2 z-40
      w-12 h-20
      flex items-center justify-center
      bg-gradient-to-l from-black/80 to-transparent
      cursor-pointer
      opacity-0 group-hover:opacity-100
      transition duration-300
    "
        >
            <span className="text-white text-3xl font-bold">›</span>
        </div>
    )

    const PrevArrow = ({ onClick }: any) => (
        <div
            onClick={onClick}
            className="
      absolute left-0 top-1/2 -translate-y-1/2 z-40
      w-12 h-20
      flex items-center justify-center
      bg-gradient-to-r from-black/80 to-transparent
      cursor-pointer
      opacity-0 group-hover:opacity-100
      transition duration-300
    "
        >
            <span className="text-white text-3xl font-bold">‹</span>
        </div>
    )

    // const settings = {
    //     dots: false,
    //     infinite: true,
    //     speed: 600,
    //     slidesToShow: 6,
    //     slidesToScroll: 2,
    //     swipeToSlide: true,
    //     draggable: true,
    //     initialSlide: 0,
    //     adaptiveHeight: false,
    //     mobileFirst: true,
    //     nextArrow: <NextArrow />,
    //     prevArrow: <PrevArrow />,

    //     responsive: [
    //         {
    //             breakpoint: 480,
    //             settings: {
    //                 slidesToShow: 1.5,
    //                 arrows: false
    //             }
    //         },
    //         {
    //             breakpoint: 640,
    //             settings: {
    //                 slidesToShow: 2,
    //                 arrows: false
    //             }
    //         },
    //         {
    //             breakpoint: 768,
    //             settings: {
    //                 slidesToShow: 3,
    //                 arrows: false
    //             }
    //         },
    //         {
    //             breakpoint: 1024,
    //             settings: {
    //                 slidesToShow: 4
    //             }
    //         },
    //         {
    //             breakpoint: 1280,
    //             settings: {
    //                 slidesToShow: 5
    //             }
    //         }
    //     ]
    // }

    const getSlidesToShow = (width: number) => {
        if (width < 480) return 1.2   // very small phones
        if (width < 640) return 2     // mobile
        if (width < 768) return 3     // tablet
        if (width < 1024) return 4    // small laptop
        if (width < 1280) return 6    // desktop
        return 6                      // large screen
    }

    const slidesToShow = getSlidesToShow(screenWidth)

    const settings = {
        dots: false,
        infinite: true,
        speed: 600,
        slidesToShow,
        slidesToScroll: Math.max(1, Math.floor(slidesToShow / 2)),
        swipeToSlide: true,
        draggable: true,
        initialSlide: 0,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    }

    if (!mounted) return null


    return (

        <div className="mb-12 group">

            {/* Row Title */}
            <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4 px-1 md:px-2">
                {title}
            </h2>

            <div className="w-full overflow-hidden max-w-full min-w-0">
                <Slider {...settings}>

                    {videos.map((video) => (

                        <div key={video._id} className="px-1 md:px-2">

                            <div className="
  group/card cursor-pointer
  relative

  rounded-xl overflow-hidden

  bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-black/80
  backdrop-blur-xl

  border border-white/5

  shadow-[0_8px_25px_rgba(0,0,0,0.6)]
  hover:shadow-[0_20px_60px_rgba(168,85,247,0.35)]

  transition-all duration-500 ease-out

  md:hover:-translate-y-3 md:hover:scale-[1.02]
">

                                {/* Thumbnail */}
                                <div className="relative aspect-[2.3/3]">

                                    <img
                                        src={video.thumbnail}
                                        className="w-full h-full object-cover scale-105"
                                    />

                                    {/* Hover overlay */}
                                    <div className="
                                            absolute inset-0
                                            bg-gradient-to-t from-black/70 via-black/20 to-transparent
                                            opacity-0
                                            group-hover/card:opacity-100
                                            transition duration-300
                                            flex items-center justify-center
                                            ">

                                        <div
                                            onClick={() => navigate(`/watch/${video._id}?autoplay=true`)}
                                            className="
                                                w-10 h-10 md:w-14 md:h-14 rounded-full
                                                bg-white/90 backdrop-blur-md
                                                flex items-center justify-center
                                                text-black shadow-xl
                                                opacity-0 scale-75
                                                group-hover/card:opacity-100 group-hover:scale-100
                                                transition-all duration-300
                                            "
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 ml-1"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>

                                    </div>

                                </div>

                                {/* Info */}
                                <div className="p-3">

                                    <p className="text-sm font-medium line-clamp-2">
                                        {video.title}
                                    </p>

                                </div>

                            </div>

                        </div>

                    ))}

                </Slider>
            </div>


        </div>

    )
}

export default VideoRow