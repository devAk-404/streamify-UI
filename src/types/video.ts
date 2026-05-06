export interface Video {
  genre: string | undefined
  rating: string | undefined
  _id: string
  title: string
  sections: string[]
  description?: string
  thumbnail?: string
  streamUrl: string
  createdAt?: string
}