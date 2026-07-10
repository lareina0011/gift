import { deleteMediaBlob, getMediaBlob, saveMediaBlob } from './storage'

export const AVATAR_UPDATED_EVENT = 'gg-avatar-updated'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE_MB = 8

function avatarKey(username: string) {
  return `profile-avatar-${username}`
}

export function validateAvatarFile(file: File): { ok: true } | { ok: false; message: string } {
  if (!IMAGE_TYPES.includes(file.type)) {
    return { ok: false, message: '请上传 JPG、PNG、WebP 或 GIF 格式的图片' }
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    return { ok: false, message: `头像大小请不超过 ${MAX_SIZE_MB} MB` }
  }
  return { ok: true }
}

export async function saveProfileAvatar(username: string, file: File): Promise<void> {
  await saveMediaBlob(avatarKey(username), file)
  window.dispatchEvent(new CustomEvent(AVATAR_UPDATED_EVENT, { detail: { username } }))
}

export async function removeProfileAvatar(username: string): Promise<void> {
  await deleteMediaBlob(avatarKey(username))
  window.dispatchEvent(new CustomEvent(AVATAR_UPDATED_EVENT, { detail: { username } }))
}

export async function loadProfileAvatarBlob(username: string): Promise<Blob | null> {
  return getMediaBlob(avatarKey(username))
}
