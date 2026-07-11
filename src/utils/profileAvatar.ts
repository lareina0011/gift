import { apiBlob, apiDelete, apiUpload } from '../api/client'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i
const MAX_SIZE_MB = 8

export function validateAvatarFile(file: File): { ok: true } | { ok: false; message: string } {
  const validType = IMAGE_TYPES.includes(file.type) || IMAGE_EXT.test(file.name)
  if (!validType) {
    return { ok: false, message: '请上传 JPG、PNG、WebP 或 GIF 格式的图片' }
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { ok: false, message: `头像大小请不超过 ${MAX_SIZE_MB} MB` }
  }
  return { ok: true }
}

export async function saveProfileAvatar(username: string, file: File): Promise<void> {
  await apiUpload('/api/settings/avatar', file)
}

export async function removeProfileAvatar(_username: string): Promise<void> {
  await apiDelete('/api/settings/avatar')
}

export async function loadProfileAvatarBlob(username: string): Promise<Blob | null> {
  return apiBlob(`/api/settings/avatar/${encodeURIComponent(username)}?t=${Date.now()}`)
}
