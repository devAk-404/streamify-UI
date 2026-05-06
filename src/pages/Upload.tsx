import { useState, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast"
import { uploadVideo } from "../services/VideoApiService"
import { SECTION_MAP } from "../constants"

type Step = "select" | "details" | "uploading"

const Upload = () => {

  const [step, setStep] = useState<Step>("select")
  const [file, setFile] = useState<File | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [progress, setProgress] = useState(0)
  const [rating, setRating] = useState("")
  const [genre, setGenre] = useState("")
  const [sections, setSections] = useState<string[]>([])
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [openSections, setOpenSections] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const sectionOptions = Object.keys(SECTION_MAP)

  useEffect(() => {

    if (!file) return

    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    return () => URL.revokeObjectURL(url)

  }, [file])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenSections(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!coverImage) return

    const url = URL.createObjectURL(coverImage)
    setCoverPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [coverImage])


  const onDrop = (acceptedFiles: File[]) => {

    const selected = acceptedFiles[0]

    if (!selected) return

    if (!selected.type.startsWith("video")) {
      toast.error("Please upload a valid video file")
      return
    }

    setFile(selected)
    setStep("details")
  }

  const resetForm = () => {
    setFile(null)
    setTitle("")
    setDescription("")
    setProgress(0)
    setRating("")
    setGenre("")
    setSections([])
    setPreviewUrl(null)
    setOpenSections(false)
    setStep("select")
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "video/*": [] },
    multiple: false
  })

  const handleUpload = async () => {

    if (!file || !title) {
      toast.error("Title and video are required")
      return
    }

    try {

      setStep("uploading")
      await uploadVideo(
        title,
        file,
        description,
        rating,
        genre,
        sections,
        coverImage,
        (percent: number) => setProgress(percent)
      )

      toast.success("Video uploaded successfully 🎉")

      resetForm()

    } catch (error) {

      toast.error("Upload failed ❌")
      setStep("details")

    }

  }

  return (

    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1a1a2e,_#000000_60%)]  text-white flex justify-center py-16 px-6">

      <div className="w-full max-w-3xl">

        <h1 className="text-4xl font-bold mb-10">
          Upload Video
        </h1>

        {/* STEP 1 */}

        {step === "select" && (

          <div
            {...getRootProps()}
            className="cursor-pointer border-2 border-dashed border-purple-500/40 rounded-xl p-16 text-center bg-gray-900/60 backdrop-blur-md hover:border-purple-400 hover:bg-gray-900 transition"
          >

            <input {...getInputProps()} />

            <div className="text-5xl mb-4">📤</div>

            <p className="text-xl font-medium">
              Drag & drop a video
            </p>

            <p className="text-gray-400 mt-2">
              or click to browse files
            </p>

          </div>

        )}

        {/* STEP 2 */}

        {step === "details" && file && (

          <div className="space-y-8 bg-gray-900/70 backdrop-blur-md p-8 rounded-xl shadow-lg border border-white/10">

            {/* Video Preview */}

            {previewUrl && (

              <video
                src={previewUrl}
                controls
                className="w-full rounded-lg shadow-lg"
              />

            )}

            {/* File Info */}

            <div className="text-sm text-gray-400">

              {file.name} • {(file.size / (1024 * 1024)).toFixed(2)} MB

            </div>

            {/* Title */}

            <div>

              <label className="text-sm text-gray-300 block mb-2">
                Title
              </label>

              <input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-950 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />

            </div>

            {/* Cover Image Upload */}

            <div>
              <label className="text-sm text-gray-300 block mb-2">
                Cover Image (optional)
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setCoverImage(file)
                }}
                className="w-full text-sm text-gray-400"
              />

              {coverPreview && (
                <img
                  src={coverPreview}
                  className="mt-3 w-40 rounded-lg shadow-md"
                />
              )}
            </div>

            {/* Description */}

            <div>

              <label className="text-sm text-gray-300 block mb-2">
                Description
              </label>

              <textarea
                placeholder="Describe your video..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-950 border border-white/10 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />

            </div>

            <div className="grid grid-cols-2 gap-4">

              {/* Rating */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Genre */}
              <div>
                <label className="text-sm text-gray-300 block mb-2">
                  Genre
                </label>
                <input
                  type="text"
                  placeholder="Action, Drama"
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-gray-950 border border-white/10 rounded-lg p-3 focus:ring-2 focus:ring-purple-500"
                />
              </div>

            </div>

            <div className="relative" ref={dropdownRef}>
              <label className="text-sm text-gray-300 block mb-2">
                Sections
              </label>

              {/* SELECT BOX */}
              <div
                onClick={() => setOpenSections(!openSections)}
                className="
      w-full bg-gray-950 border border-white/10 rounded-lg p-3
      cursor-pointer flex flex-wrap gap-2 items-center
      min-h-[48px]
      hover:border-purple-500 transition
    "
              >
                {sections.length === 0 && (
                  <span className="text-gray-500 text-sm">
                    Select sections
                  </span>
                )}

                {sections.map((sec) => (
                  <span
                    key={sec}
                    className="
      group flex items-center gap-1
      px-2 py-1 text-xs rounded-md
      bg-purple-500/20 text-purple-300
      border border-purple-500/30
    "
                  >
                    {sec}

                    {/* REMOVE ICON */}
                    <span
                      onClick={(e) => {
                        e.stopPropagation()
                        setSections(prev => prev.filter(s => s !== sec))
                      }}
                      className="
        opacity-0 group-hover:opacity-100
        cursor-pointer text-purple-200 hover:text-white
        transition
      "
                    >
                      ✕
                    </span>
                  </span>
                ))}
              </div>

              {/* DROPDOWN */}
              {openSections && (
                <div
                  className="
        absolute z-50 mt-2 w-full
        bg-gray-900 border border-white/10 rounded-lg
        shadow-lg overflow-hidden
        backdrop-blur-md
      "
                >
                  {sectionOptions.map((sec) => {
                    const selected = sections.includes(sec)

                    return (
                      <div
                        key={sec}
                        onClick={() => {
                          if (selected) {
                            setSections(prev => prev.filter(s => s !== sec))
                          } else {
                            setSections(prev => [...prev, sec])
                          }
                        }}
                        className={`
              px-4 py-2 cursor-pointer flex justify-between items-center
              hover:bg-white/5 transition
              ${selected ? "text-purple-400" : "text-gray-300"}
            `}
                      >
                        <span>{SECTION_MAP[sec]}</span>

                        {selected && (
                          <span className="text-purple-400">✓</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Buttons */}

            <div className="flex gap-4">

              <button
                onClick={resetForm}
                className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition"
              >
                Change Video
              </button>

              <button
                onClick={handleUpload}
                className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition shadow-md"
              >
                Upload Video
              </button>

            </div>

          </div>

        )}

        {/* STEP 3 */}

        {step === "uploading" && (

          <div className="bg-gray-900/70 backdrop-blur-md p-10 rounded-xl border border-white/10">

            <p className="text-lg mb-6">
              Uploading Video...
            </p>

            <div className="w-full bg-gray-800 rounded-full overflow-hidden">

              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 transition-all"
                style={{ width: `${progress}%` }}
              />

            </div>

            <p className="mt-3 text-sm text-gray-400">
              {progress}%
            </p>

          </div>

        )}

      </div>

    </div>
  )
}

export default Upload