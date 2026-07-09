import { useCallback, useEffect, useRef, useState } from 'react'
import defaultHero from '../assets/backend_background.png'
import defaultLogin from '../assets/login_backend.png'
import {
  BG_UPDATED_EVENT,
  loadBackgroundBlob,
  removeBackgroundImage,
  saveBackgroundImage,
  validateBackgroundFile,
  type BackgroundImageType,
} from '../utils/backgroundImages'

interface BackgroundImagesState {
  ready: boolean
  loginBgUrl: string | null
  heroCoverUrl: string | null
  hasCustomLogin: boolean
  hasCustomHero: boolean
  defaultHeroUrl: string
  defaultLoginUrl: string
  uploadBackground: (type: BackgroundImageType, file: File) => Promise<{ ok: boolean; message: string }>
  removeBackground: (type: BackgroundImageType) => Promise<void>
}

export function useBackgroundImages(): BackgroundImagesState {
  const [ready, setReady] = useState(false)
  const [loginBgUrl, setLoginBgUrl] = useState<string | null>(null)
  const [heroCoverUrl, setHeroCoverUrl] = useState<string | null>(null)
  const [hasCustomLogin, setHasCustomLogin] = useState(false)
  const [hasCustomHero, setHasCustomHero] = useState(false)
  const urlsRef = useRef<{ login: string | null; hero: string | null }>({
    login: null,
    hero: null,
  })

  const revokeUrls = useCallback(() => {
    if (urlsRef.current.login) URL.revokeObjectURL(urlsRef.current.login)
    if (urlsRef.current.hero) URL.revokeObjectURL(urlsRef.current.hero)
    urlsRef.current = { login: null, hero: null }
  }, [])

  const reload = useCallback(async () => {
    revokeUrls()

    const [loginBlob, heroBlob] = await Promise.all([
      loadBackgroundBlob('login'),
      loadBackgroundBlob('hero'),
    ])

    const loginUrl = loginBlob ? URL.createObjectURL(loginBlob) : null
    const heroUrl = heroBlob ? URL.createObjectURL(heroBlob) : null

    urlsRef.current = { login: loginUrl, hero: heroUrl }
    setLoginBgUrl(loginUrl)
    setHeroCoverUrl(heroUrl)
    setHasCustomLogin(!!loginBlob)
    setHasCustomHero(!!heroBlob)
    setReady(true)
  }, [revokeUrls])

  useEffect(() => {
    reload()
    const onUpdate = () => {
      reload()
    }
    window.addEventListener(BG_UPDATED_EVENT, onUpdate)
    return () => {
      window.removeEventListener(BG_UPDATED_EVENT, onUpdate)
      revokeUrls()
    }
  }, [reload, revokeUrls])

  const uploadBackground = useCallback(async (type: BackgroundImageType, file: File) => {
    const validation = validateBackgroundFile(file)
    if (!validation.ok) return validation

    try {
      await saveBackgroundImage(type, file)
      return { ok: true, message: '背景已更新' }
    } catch {
      return { ok: false, message: '保存失败，请稍后再试' }
    }
  }, [])

  const removeBackground = useCallback(async (type: BackgroundImageType) => {
    await removeBackgroundImage(type)
  }, [])

  return {
    ready,
    loginBgUrl,
    heroCoverUrl,
    hasCustomLogin,
    hasCustomHero,
    defaultHeroUrl: defaultHero,
    defaultLoginUrl: defaultLogin,
    uploadBackground,
    removeBackground,
  }
}
