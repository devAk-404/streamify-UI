import axios from "axios"
import type { Video } from "../types/video"

const API_BASE = "http://13.60.7.117:5000/api/videos"

/**
 * Upload video
 */
export const uploadVideo = async (
  title: string,
  file: File,
  description?: string,
  rating?: string,
  genre?: string,
  sections?: string[],
  coverImage?: File | null,
  onProgress?: (progress: number) => void
): Promise<Video> => {

  const formData = new FormData()

  formData.append("title", title)
  formData.append("video", file)
  formData.append("sections", JSON.stringify(sections))

  if (description) formData.append("description", description)
  if (rating) formData.append("rating", rating)
  if (genre) formData.append("genre", genre)
  if (coverImage) { formData.append("coverImage", coverImage) }

  const response = await axios.post(
    `${API_BASE}/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data"
      },
      onUploadProgress: (event) => {

        if (!event.total) return

        const percent =
          Math.round((event.loaded * 100) / event.total)

        if (onProgress) onProgress(percent)
      }
    }
  )

  return response.data.video
}

/**
 * Fetch all videos
 */
export const getVideos = async (): Promise<Video[]> => {

  const response = await axios.get(`${API_BASE}`)

  return response.data
}

/**
 * Fetch single video
 */
export const getVideoById = async (
  id: string
): Promise<Video> => {

  const response = await axios.get(`${API_BASE}/${id}`)

  return response.data
}

/**
 * Update video metadata
 */
export const updateVideo = async (
  id: string,
  data: {
    title?: string
    description?: string
  }
): Promise<Video> => {

  const response = await axios.put(
    `${API_BASE}/${id}`,
    data
  )

  return response.data
}

/**
 * Delete video
 */
export const deleteVideo = async (
  id: string
): Promise<{ success: boolean }> => {

  const response = await axios.delete(
    `${API_BASE}/${id}`
  )

  return response.data
}