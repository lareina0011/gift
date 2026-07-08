export type StageId =
  | 'primary'
  | 'middle'
  | 'high'
  | 'college'
  | 'graduate'
  | 'future'

export type MediaType = 'image' | 'video'

export interface MediaItem {
  id: string
  type: MediaType
  name: string
  blobKey: string
}

export interface Memory {
  id: string
  stageId: StageId
  title: string
  content: string
  date: string
  media: MediaItem[]
  createdAt: string
}

export interface FutureWish {
  id: string
  text: string
  emoji: string
  createdAt: string
}

export interface AuthAccount {
  username: string
  password: string
  role: 'admin'
}
