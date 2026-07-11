import { useCallback, useEffect, useRef, useState } from 'react'
import { ApiError } from '../api/client'
import {
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
  const reloadIdRef = useRef(0)

  const setAvatarFromUrl = useCallback((nextUrl: string | null, custom: boolean) => {
    const prevUrl = urlRef.current
    urlRef.current = nextUrl
    setAvatarUrl(nextUrl)
    setHasCustomAvatar(custom)
    if (prevUrl && prevUrl !== nextUrl) {
      URL.revokeObjectURL(prevUrl)
    }
  }, [])

  const reload = useCallback(async () => {
    const reloadId = ++reloadIdRef.current
    const blob = await loadProfileAvatarBlob(username)
    if (reloadId !== reloadIdRef.current) return

    const nextUrl = blob ? URL.createObjectURL(blob) : null
    setAvatarFromUrl(nextUrl, !!blob)
    setReady(true)
  }, [username, setAvatarFromUrl])

  useEffect(() => {
    setReady(false)
    reload()
    return () => {
      reloadIdRef.current += 1
      if (urlRef.current) {
        URL.revokeObjectURL(urlRef.current)
        urlRef.current = null
      }
    }
  }, [reload])

  const uploadAvatar = useCallback(
    async (file: File) => {
      const validation = validateAvatarFile(file)
      if (!validation.ok) return validation
      try {
        const previewUrl = URL.createObjectURL(file)
        setAvatarFromUrl(previewUrl, true)

        await saveProfileAvatar(username, file)
        await reload()
        return { ok: true, message: '头像已更新' }
      } catch (err) {
        await reload()
        const message = err instanceof ApiError ? err.message : '保存失败，请稍后再试'
        return { ok: false, message }
      }
    },
    [username, reload, setAvatarFromUrl],
  )

  const removeAvatar = useCallback(async () => {
    await removeProfileAvatar(username)
    await reload()
  }, [username, reload])

  return { ready, avatarUrl, hasCustomAvatar, uploadAvatar, removeAvatar }
}
