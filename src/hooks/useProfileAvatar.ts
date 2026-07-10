import { useCallback, useEffect, useRef, useState } from 'react'
import {
  AVATAR_UPDATED_EVENT,
  loadProfileAvatarBlob,
  removeProfileAvatar,
  saveProfileAvatar,
  validateAvatarFile,
} from '../utils/profileAvatar'

export function useProfileAvatar(username: string) {
  const [ready, setReady] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [hasCustomAvatar, setHasCustomAvatar] = useState(false)
  const urlRef = useRef<string | null>(null)

  const revokeUrl = useCallback(() => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
  }, [])

  const reload = useCallback(async () => {
    revokeUrl()
    const blob = await loadProfileAvatarBlob(username)
    const url = blob ? URL.createObjectURL(blob) : null
    urlRef.current = url
    setAvatarUrl(url)
    setHasCustomAvatar(!!blob)
    setReady(true)
  }, [username, revokeUrl])

  useEffect(() => {
    setReady(false)
    reload()
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent<{ username?: string }>).detail
      if (!detail?.username || detail.username === username) reload()
    }
    window.addEventListener(AVATAR_UPDATED_EVENT, onUpdate)
    return () => {
      window.removeEventListener(AVATAR_UPDATED_EVENT, onUpdate)
      revokeUrl()
    }
  }, [username, reload, revokeUrl])

  const uploadAvatar = useCallback(
    async (file: File) => {
      const validation = validateAvatarFile(file)
      if (!validation.ok) return validation
      try {
        await saveProfileAvatar(username, file)
        return { ok: true, message: '头像已更新' }
      } catch {
        return { ok: false, message: '保存失败，请稍后再试' }
      }
    },
    [username],
  )

  const removeAvatar = useCallback(async () => {
    await removeProfileAvatar(username)
  }, [username])

  return { ready, avatarUrl, hasCustomAvatar, uploadAvatar, removeAvatar }
}
