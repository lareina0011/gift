import { useCallback, useEffect, useState } from 'react'
import {
  createLetterVoice,
  deleteLetterVoiceApi,
  fetchLetter,
  updateLetterApi,
} from '../api/data'
import type { SiteLetter } from '../types'

export function useLetter() {
  const [letter, setLetter] = useState<SiteLetter | null>(null)
  const [ready, setReady] = useState(false)

  const reload = useCallback(async () => {
    try {
      const next = await fetchLetter()
      setLetter(next)
    } catch {
      setLetter(null)
    } finally {
      setReady(true)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const saveLetter = useCallback(async (title: string, body: string) => {
    const next = await updateLetterApi(title, body)
    setLetter(next)
    return next
  }, [])

  const addVoice = useCallback(async (file: File, label: string) => {
    const voice = await createLetterVoice(file, label)
    setLetter((prev) =>
      prev
        ? { ...prev, voices: [...prev.voices, voice].sort((a, b) => a.sortOrder - b.sortOrder) }
        : prev,
    )
    return voice
  }, [])

  const removeVoice = useCallback(async (id: string) => {
    await deleteLetterVoiceApi(id)
    setLetter((prev) =>
      prev ? { ...prev, voices: prev.voices.filter((v) => v.id !== id) } : prev,
    )
  }, [])

  return { ready, letter, reload, saveLetter, addVoice, removeVoice }
}
