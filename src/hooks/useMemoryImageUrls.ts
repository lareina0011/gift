import { useEffect, useState } from 'react'
import { apiBlob } from '../api/client'
import type { Memory } from '../types'

export interface MemoryImageEntry {
  url: string
  blobKey: string
  memoryId: string
  mediaId: string
  title: string
}

const MAX_ORBIT_IMAGES = 24

export function useMemoryImageUrls(memories: Memory[]) {
  const [images, setImages] = useState<MemoryImageEntry[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    const objectUrls: string[] = []

    const load = async () => {
      const entries = memories
        .flatMap((memory) =>
          memory.media
            .filter((item) => item.type === 'image')
            .map((item) => ({
              blobKey: item.blobKey,
              memoryId: memory.id,
              mediaId: item.id,
              title: memory.title,
              date: memory.date,
            })),
        )
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, MAX_ORBIT_IMAGES)

      const loaded: MemoryImageEntry[] = []

      for (const entry of entries) {
        const blob = await apiBlob(`/api/media/${entry.blobKey}`)
        if (cancelled) return
        if (!blob) continue
        const url = URL.createObjectURL(blob)
        objectUrls.push(url)
        loaded.push({
          url,
          blobKey: entry.blobKey,
          memoryId: entry.memoryId,
          mediaId: entry.mediaId,
          title: entry.title,
        })
      }

      if (!cancelled) {
        setImages(loaded)
        setReady(true)
      }
    }

    setReady(false)
    load()

    return () => {
      cancelled = true
      objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [memories])

  return { images, ready, totalImageCount: memories.reduce(
    (count, memory) => count + memory.media.filter((item) => item.type === 'image').length,
    0,
  ) }
}
