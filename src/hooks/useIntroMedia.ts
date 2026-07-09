import { useCallback, useEffect, useRef, useState } from 'react'
import {
  INTRO_UPDATED_EVENT,
  loadIntroBlob,
  removeIntroMedia,
  saveIntroMedia,
  validateIntroAudio,
  validateIntroImage,
  type IntroMediaType,
} from '../utils/introMedia'

interface IntroMediaState {
  ready: boolean
  introImageUrl: string | null
  introAudioUrl: string | null
  hasIntroImage: boolean
  hasIntroAudio: boolean
  hasIntroMedia: boolean
  uploadIntroMedia: (type: IntroMediaType, file: File) => Promise<{ ok: boolean; message: string }>
  removeIntroMedia: (type: IntroMediaType) => Promise<void>
}

export function useIntroMedia(): IntroMediaState {
  const [ready, setReady] = useState(false)
  const [introImageUrl, setIntroImageUrl] = useState<string | null>(null)
  const [introAudioUrl, setIntroAudioUrl] = useState<string | null>(null)
  const [hasIntroImage, setHasIntroImage] = useState(false)
  const [hasIntroAudio, setHasIntroAudio] = useState(false)
  const urlsRef = useRef<{ image: string | null; audio: string | null }>({
    image: null,
    audio: null,
  })

  const revokeUrls = useCallback(() => {
    if (urlsRef.current.image) URL.revokeObjectURL(urlsRef.current.image)
    if (urlsRef.current.audio) URL.revokeObjectURL(urlsRef.current.audio)
    urlsRef.current = { image: null, audio: null }
  }, [])

  const reload = useCallback(async () => {
    revokeUrls()

    const [imageBlob, audioBlob] = await Promise.all([
      loadIntroBlob('image'),
      loadIntroBlob('audio'),
    ])

    const imageUrl = imageBlob ? URL.createObjectURL(imageBlob) : null
    const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null

    urlsRef.current = { image: imageUrl, audio: audioUrl }
    setIntroImageUrl(imageUrl)
    setIntroAudioUrl(audioUrl)
    setHasIntroImage(!!imageBlob)
    setHasIntroAudio(!!audioBlob)
    setReady(true)
  }, [revokeUrls])

  useEffect(() => {
    reload()
    const onUpdate = () => reload()
    window.addEventListener(INTRO_UPDATED_EVENT, onUpdate)
    return () => {
      window.removeEventListener(INTRO_UPDATED_EVENT, onUpdate)
      revokeUrls()
    }
  }, [reload, revokeUrls])

  const uploadIntroMedia = useCallback(async (type: IntroMediaType, file: File) => {
    const validation = type === 'image' ? validateIntroImage(file) : validateIntroAudio(file)
    if (!validation.ok) return validation

    try {
      await saveIntroMedia(type, file)
      return { ok: true, message: '已保存' }
    } catch {
      return { ok: false, message: '保存失败，请稍后再试' }
    }
  }, [])

  const removeIntroMediaItem = useCallback(async (type: IntroMediaType) => {
    await removeIntroMedia(type)
  }, [])

  return {
    ready,
    introImageUrl,
    introAudioUrl,
    hasIntroImage,
    hasIntroAudio,
    hasIntroMedia: hasIntroImage || hasIntroAudio,
    uploadIntroMedia,
    removeIntroMedia: removeIntroMediaItem,
  }
}
