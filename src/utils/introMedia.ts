import { deleteMediaBlob, getMediaBlob, saveMediaBlob } from './storage'

export const INTRO_MEDIA_KEYS = {
  image: 'intro-image',
  audio: 'intro-audio',
} as const

export type IntroMediaType = keyof typeof INTRO_MEDIA_KEYS

export const INTRO_UPDATED_EVENT = 'gg-intro-updated'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a', 'audio/aac']
const MAX_IMAGE_MB = 12
const MAX_AUDIO_MB = 25

export function validateIntroImage(file: File): { ok: true } | { ok: false; message: string } {
  if (!IMAGE_TYPES.includes(file.type)) {
    return { ok: false, message: '请上传 JPG、PNG、WebP 或 GIF 格式的图片' }
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return { ok: false, message: `图片大小请不超过 ${MAX_IMAGE_MB} MB` }
  }
  return { ok: true }
}

export function validateIntroAudio(file: File): { ok: true } | { ok: false; message: string } {
  const valid =
    AUDIO_TYPES.includes(file.type) ||
    /\.(mp3|wav|ogg|m4a|aac)$/i.test(file.name)
  if (!valid) {
    return { ok: false, message: '请上传 MP3、WAV、OGG 或 M4A 格式的音频' }
  }
  if (file.size > MAX_AUDIO_MB * 1024 * 1024) {
    return { ok: false, message: `音频大小请不超过 ${MAX_AUDIO_MB} MB` }
  }
  return { ok: true }
}

export async function saveIntroMedia(type: IntroMediaType, file: File): Promise<void> {
  await saveMediaBlob(INTRO_MEDIA_KEYS[type], file)
  window.dispatchEvent(new CustomEvent(INTRO_UPDATED_EVENT, { detail: { type } }))
}

export async function removeIntroMedia(type: IntroMediaType): Promise<void> {
  await deleteMediaBlob(INTRO_MEDIA_KEYS[type])
  window.dispatchEvent(new CustomEvent(INTRO_UPDATED_EVENT, { detail: { type } }))
}

export async function loadIntroBlob(type: IntroMediaType): Promise<Blob | null> {
  return getMediaBlob(INTRO_MEDIA_KEYS[type])
}

const INTRO_SESSION_KEY = 'gg-intro-session-done'

export function hasPlayedIntroThisSession(): boolean {
  return sessionStorage.getItem(INTRO_SESSION_KEY) === 'true'
}

export function markIntroPlayedThisSession(): void {
  sessionStorage.setItem(INTRO_SESSION_KEY, 'true')
}

export function clearIntroSession(): void {
  sessionStorage.removeItem(INTRO_SESSION_KEY)
}
