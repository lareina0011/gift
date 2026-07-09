import { deleteMediaBlob, getMediaBlob, saveMediaBlob } from './storage'

export const BG_IMAGE_KEYS = {
  login: 'bg-login',
  hero: 'bg-hero-cover',
} as const

export type BackgroundImageType = keyof typeof BG_IMAGE_KEYS

export const BG_UPDATED_EVENT = 'gg-background-updated'

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 12

export function validateBackgroundFile(file: File): { ok: true } | { ok: false; message: string } {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { ok: false, message: '请上传 JPG、PNG、WebP 或 GIF 格式的图片' }
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { ok: false, message: `图片大小请不超过 ${MAX_SIZE_MB} MB` }
  }
  return { ok: true }
}

export async function saveBackgroundImage(type: BackgroundImageType, file: File): Promise<void> {
  await saveMediaBlob(BG_IMAGE_KEYS[type], file)
  window.dispatchEvent(new CustomEvent(BG_UPDATED_EVENT, { detail: { type } }))
}

export async function removeBackgroundImage(type: BackgroundImageType): Promise<void> {
  await deleteMediaBlob(BG_IMAGE_KEYS[type])
  window.dispatchEvent(new CustomEvent(BG_UPDATED_EVENT, { detail: { type } }))
}

export async function loadBackgroundBlob(type: BackgroundImageType): Promise<Blob | null> {
  return getMediaBlob(BG_IMAGE_KEYS[type])
}

export async function hasBackgroundImage(type: BackgroundImageType): Promise<boolean> {
  const blob = await getMediaBlob(BG_IMAGE_KEYS[type])
  return blob !== null
}
