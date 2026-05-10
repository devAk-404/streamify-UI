import { useState, useEffect, useRef } from "react"
import { useDropzone } from "react-dropzone"
import toast from "react-hot-toast"
import { uploadVideo } from "../services/VideoApiService"
import { SECTION_MAP } from "../constants"

type Step = "select" | "details" | "uploading"

const fmt = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2) + " MB"

const Upload = () => {
  const [step, setStep]                 = useState<Step>("select")
  const [file, setFile]                 = useState<File | null>(null)
  const [title, setTitle]               = useState("")
  const [description, setDescription]   = useState("")
  const [progress, setProgress]         = useState(0)
  const [rating, setRating]             = useState("")
  const [genre, setGenre]               = useState("")
  const [sections, setSections]         = useState<string[]>([])
  const [coverImage, setCoverImage]     = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl]     = useState<string | null>(null)
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
    if (!coverImage) return
    const url = URL.createObjectURL(coverImage)
    setCoverPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [coverImage])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setOpenSections(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const onDrop = (acceptedFiles: File[]) => {
    const selected = acceptedFiles[0]
    if (!selected) return
    if (!selected.type.startsWith("video")) { toast.error("Please upload a valid video file"); return }
    setFile(selected)
    setStep("details")
  }

  const resetForm = () => {
    setFile(null); setTitle(""); setDescription(""); setProgress(0)
    setRating(""); setGenre(""); setSections([]); setPreviewUrl(null)
    setCoverImage(null); setCoverPreview(null); setOpenSections(false)
    setStep("select")
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { "video/*": [] }, multiple: false,
  })

  const handleUpload = async () => {
    if (!file || !title) { toast.error("Title and video are required"); return }
    try {
      setStep("uploading")
      await uploadVideo(title, file, description, rating, genre, sections, coverImage,
        (percent: number) => setProgress(percent))
      toast.success("Video uploaded successfully 🎉")
      resetForm()
    } catch {
      toast.error("Upload failed ❌")
      setStep("details")
    }
  }

  const toggleSection = (sec: string) =>
    setSections(prev => prev.includes(sec) ? prev.filter(s => s !== sec) : [...prev, sec])

  return (
    /*
      h-full fills the slot given by App's `flex-1 min-h-0` div.
      overflow-hidden here so nothing leaks out of this page.
      flex-col: header (flex-shrink-0) pinned, scrollable body below.
    */
    <div className="h-full overflow-hidden flex flex-col">

      {/* ── Page header — pinned, never scrolls ── */}
      <div className="flex-shrink-0 px-6 md:px-12 pt-8 pb-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Upload{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            Video
          </span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Add a new video to your library</p>
      </div>

      {/* ── Scrollable form area — ONLY this scrolls ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 md:px-12 pb-12">
        <div className="max-w-3xl mx-auto w-full space-y-6">

          {/* ══════════ STEP 1: SELECT ══════════ */}
          {step === "select" && (
            <div
              {...getRootProps()}
              className={`
                relative cursor-pointer rounded-2xl p-20 text-center
                border-2 border-dashed transition-all duration-300
                bg-gray-900/50 backdrop-blur-md
                ${isDragActive
                  ? "border-purple-400 bg-purple-500/10 scale-[1.01]"
                  : "border-white/10 hover:border-purple-500/50 hover:bg-gray-900/80"}
              `}
            >
              <input {...getInputProps()} />
              <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">
                <div className={`
                  inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6
                  bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10
                  transition-transform duration-300 ${isDragActive ? "scale-110" : ""}
                `}>
                  <svg className="w-9 h-9 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <p className="text-xl font-semibold text-white">
                  {isDragActive ? "Drop it here" : "Drag & drop your video"}
                </p>
                <p className="text-gray-500 mt-2 text-sm">
                  or <span className="text-purple-400 underline underline-offset-2">browse files</span>
                </p>
                <p className="text-gray-600 text-xs mt-4">MP4, MOV, MKV, AVI supported</p>
              </div>
            </div>
          )}

          {/* ══════════ STEP 2: DETAILS ══════════ */}
          {step === "details" && file && (
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/60 backdrop-blur-md shadow-2xl">

              {/* Video preview — overflow-hidden scoped here so it clips to rounded top corners without affecting the dropdown */}
              {previewUrl && (
                <div className="relative bg-black rounded-t-2xl overflow-hidden">
                  <video src={previewUrl} controls className="w-full max-h-64 object-contain" />
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/60 to-transparent pointer-events-none" />
                </div>
              )}

              {/* File pill */}
              <div className="px-6 py-3 border-b border-white/[0.06] flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="truncate max-w-[200px] md:max-w-xs">{file.name}</span>
                  <span className="text-gray-600">•</span>
                  <span className="flex-shrink-0">{fmt(file.size)}</span>
                </div>
                <button
                  onClick={resetForm}
                  className="text-xs text-gray-500 hover:text-white transition flex items-center gap-1 flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Change
                </button>
              </div>

              {/* Fields */}
              <div className="p-6 space-y-5">

                {/* Title */}
                <Field label="Title" required>
                  <input
                    type="text" placeholder="Enter video title" value={title}
                    onChange={(e) => setTitle(e.target.value)} className={inputCls}
                  />
                </Field>

                {/* Cover image */}
                <Field label="Cover Image" hint="optional">
                  <label className="flex items-center gap-3 cursor-pointer w-full rounded-xl border border-white/10 bg-gray-950/60 p-3 hover:border-purple-500/50 transition group">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-400 group-hover:text-gray-200 transition">
                      {coverImage ? coverImage.name : "Choose cover image…"}
                    </span>
                    <input type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) setCoverImage(f) }} />
                  </label>
                  {coverPreview && (
                    <div className="mt-3 relative inline-block">
                      <img src={coverPreview} className="w-36 h-24 object-cover rounded-xl border border-white/10 shadow-lg" alt="Cover" />
                      <button
                        onClick={() => { setCoverImage(null); setCoverPreview(null) }}
                        className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-gray-800 border border-white/20 text-gray-300 hover:text-white flex items-center justify-center text-xs transition"
                      >✕</button>
                    </div>
                  )}
                </Field>

                {/* Description */}
                <Field label="Description">
                  <textarea
                    placeholder="Describe your video…" value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputCls} h-28 resize-none`}
                  />
                </Field>

                {/* Rating + Genre */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Rating" hint="0 – 10">
                    <input type="number" step="0.1" min="0" max="10" placeholder="8.5"
                      value={rating} onChange={(e) => setRating(e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Genre">
                    <input type="text" placeholder="Action, Drama…"
                      value={genre} onChange={(e) => setGenre(e.target.value)} className={inputCls} />
                  </Field>
                </div>

                {/* Sections */}
                <Field label="Sections">
                  <div className="relative" ref={dropdownRef}>

                    {/* Trigger */}
                    <div
                      onClick={() => setOpenSections(!openSections)}
                      className={`
                        w-full min-h-[46px] rounded-xl border bg-gray-950/60 px-3 py-2
                        cursor-pointer flex flex-wrap gap-1.5 items-center
                        transition-all duration-200
                        ${openSections
                          ? "border-purple-500/60 ring-1 ring-purple-500/30"
                          : "border-white/10 hover:border-white/20"}
                      `}
                    >
                      {sections.length === 0 && (
                        <span className="text-gray-500 text-sm">Select sections…</span>
                      )}
                      {sections.map((sec) => (
                        <span key={sec} className="group flex items-center gap-1 px-2 py-0.5 text-xs rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          {SECTION_MAP[sec] || sec}
                          <span
                            onClick={(e) => { e.stopPropagation(); setSections(prev => prev.filter(s => s !== sec)) }}
                            className="opacity-60 group-hover:opacity-100 cursor-pointer hover:text-white transition ml-0.5"
                          >✕</span>
                        </span>
                      ))}
                      <span className={`ml-auto text-gray-500 transition-transform duration-200 ${openSections ? "rotate-180" : ""}`}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </div>

                    {/* Dropdown — fixed max-height + overflow-y-auto so it scrolls internally */}
                    {openSections && (
                      <div className="
                        absolute z-50 mt-1.5 w-full rounded-xl
                        bg-gray-900/95 backdrop-blur-md
                        border border-white/10 shadow-2xl
                        max-h-48 overflow-y-auto
                        scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10
                      ">
                        {sectionOptions.map((sec) => {
                          const selected = sections.includes(sec)
                          return (
                            <div
                              key={sec}
                              onClick={() => toggleSection(sec)}
                              className={`
                                px-4 py-2.5 cursor-pointer flex justify-between items-center text-sm
                                hover:bg-white/5 transition
                                ${selected ? "text-purple-300" : "text-gray-300"}
                              `}
                            >
                              <span>{SECTION_MAP[sec] || sec}</span>
                              {selected && (
                                <svg className="w-4 h-4 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </Field>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={resetForm}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={!title.trim()}
                    className="flex-1 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Upload Video
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* ══════════ STEP 3: UPLOADING ══════════ */}
          {step === "uploading" && (
            <div className="rounded-2xl border border-white/[0.08] bg-gray-900/60 backdrop-blur-md p-10 text-center space-y-6">
              <div className="relative inline-flex items-center justify-center">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="white" strokeOpacity="0.06" strokeWidth="8" />
                  <circle
                    cx="48" cy="48" r="40" fill="none"
                    stroke="url(#prog)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="prog" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <span className="absolute text-xl font-bold text-white">{progress}%</span>
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Uploading…</p>
                <p className="text-gray-500 text-sm mt-1">Please keep this tab open</p>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// ─── Shared components ───────────────────────────────────────────────────────

const Field = ({ label, hint, required, children }: {
  label: string; hint?: string; required?: boolean; children: React.ReactNode
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-400 uppercase tracking-wider">
      {label}
      {required && <span className="text-pink-500">*</span>}
      {hint && <span className="normal-case text-gray-600 font-normal">({hint})</span>}
    </label>
    {children}
  </div>
)

const inputCls = `
  w-full rounded-xl border border-white/10 bg-gray-950/60
  px-3.5 py-2.5 text-sm text-white placeholder-gray-600
  focus:outline-none focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500/60
  transition-all duration-200
`

export default Upload