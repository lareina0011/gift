import { useCallback, useEffect, useRef, useState } from 'react'
import { apiBlob, apiDelete, apiFetch } from '../api/client'

const BGM_ENABLED_KEY = 'gg-bgm-enabled'
const BGM_VOLUME_KEY = 'gg-bgm-volume'

export function useBgm() {
  const [url, setUrl] = useState<string | null>(null)
  const [hasBgm, setHasBgm] = useState(false)
  const [ready, setReady] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [enabled, setEnabled] = useState(() => localStorage.getItem(BGM_ENABLED_KEY) === '1')
  const [volume, setVolumeState] = useState(() => {
    const v = Number(localStorage.getItem(BGM_VOLUME_KEY))
    return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0.35
  })
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const pausedByIntro = useRef(false)

  const reload = useCallback(async () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = null
    const blob = await apiBlob('/api/settings/bgm')
    if (blob) {
      const objectUrl = URL.createObjectURL(blob)
      urlRef.current = objectUrl
      setUrl(objectUrl)
      setHasBgm(true)
    } else {
      setUrl(null)
      setHasBgm(false)
      setPlaying(false)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    reload()
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [reload])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !url) return
    audio.src = url
    audio.loop = true
    audio.volume = volume
  }, [url, volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !url) return
    if (enabled && !pausedByIntro.current) {
      audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    } else {
      audio.pause()
      setPlaying(false)
    }
  }, [enabled, url])

  const setVolume = useCallback((v: number) => {
    const next = Math.min(1, Math.max(0, v))
    setVolumeState(next)
    localStorage.setItem(BGM_VOLUME_KEY, String(next))
    if (audioRef.current) audioRef.current.volume = next
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      localStorage.setItem(BGM_ENABLED_KEY, next ? '1' : '0')
      return next
    })
  }, [])

  const pauseForIntro = useCallback(() => {
    pausedByIntro.current = true
    audioRef.current?.pause()
    setPlaying(false)
  }, [])

  const resumeAfterIntro = useCallback(() => {
    pausedByIntro.current = false
    if (enabled && audioRef.current && url) {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => undefined)
    }
  }, [enabled, url])

  const uploadBgm = useCallback(async (file: File) => {
    if (!file.type.startsWith('audio/')) {
      return { ok: false as const, message: '请上传音频文件' }
    }
    if (file.size > 25 * 1024 * 1024) {
      return { ok: false as const, message: '音频请小于 25MB' }
    }
    const form = new FormData()
    form.append('file', file)
    const res = await apiFetch('/api/settings/bgm', { method: 'POST', body: form })
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string }
      return { ok: false as const, message: err.error ?? '上传失败' }
    }
    await reload()
    return { ok: true as const, message: '背景音乐已更新' }
  }, [reload])

  const removeBgm = useCallback(async () => {
    await apiDelete('/api/settings/bgm')
    await reload()
  }, [reload])

  return {
    ready,
    hasBgm,
    url,
    playing,
    enabled,
    volume,
    audioRef,
    toggle,
    setVolume,
    pauseForIntro,
    resumeAfterIntro,
    uploadBgm,
    removeBgm,
  }
}
