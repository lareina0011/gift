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
  unlockAt?: string | null
  locked?: boolean
}

export interface FutureWish {
  id: string
  text: string
  emoji: string
  createdAt: string
}

export type UserRole = 'editor' | 'viewer'

export interface StageBlessing {
  id: string
  stageId: StageId
  friendName: string
  caption: string
  blobKey: string
  sortOrder: number
  createdAt: string
}

export interface LetterVoice {
  id: string
  blobKey: string
  label: string
  sortOrder: number
  createdAt: string
}

export interface SiteLetter {
  id: string
  title: string
  body: string
  updatedAt: string
  voices: LetterVoice[]
}

export interface AuthAccount {
  username: string
  password: string
  role: UserRole
}
