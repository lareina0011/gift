import { useCallback, useEffect, useState } from 'react'
import type { FutureWish, Memory, StageId } from '../types'
import {
  deleteMediaBlob,
  generateId,
  loadMemories,
  loadWishes,
  saveMediaBlob,
  saveMemories,
  saveWishes,
} from '../utils/storage'

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [wishes, setWishes] = useState<FutureWish[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setMemories(loadMemories())
    setWishes(loadWishes())
    setReady(true)
  }, [])

  const persistMemories = useCallback((next: Memory[]) => {
    setMemories(next)
    saveMemories(next)
  }, [])

  const persistWishes = useCallback((next: FutureWish[]) => {
    setWishes(next)
    saveWishes(next)
  }, [])

  const addMemory = useCallback(
    async (
      stageId: StageId,
      data: { title: string; content: string; date: string; files: File[] },
    ) => {
      const media = await Promise.all(
        data.files.map(async (file) => {
          const blobKey = generateId()
          await saveMediaBlob(blobKey, file)
          const type = file.type.startsWith('video/') ? 'video' : 'image'
          return {
            id: generateId(),
            type: type as 'image' | 'video',
            name: file.name,
            blobKey,
          }
        }),
      )

      const memory: Memory = {
        id: generateId(),
        stageId,
        title: data.title,
        content: data.content,
        date: data.date,
        media,
        createdAt: new Date().toISOString(),
      }

      persistMemories([memory, ...loadMemories()])
      return memory
    },
    [persistMemories],
  )

  const deleteMemory = useCallback(
    async (id: string) => {
      const current = loadMemories()
      const target = current.find((m) => m.id === id)
      if (target) {
        await Promise.all(target.media.map((m) => deleteMediaBlob(m.blobKey)))
      }
      persistMemories(current.filter((m) => m.id !== id))
    },
    [persistMemories],
  )

  const addWish = useCallback(
    (text: string, emoji: string) => {
      const wish: FutureWish = {
        id: generateId(),
        text,
        emoji,
        createdAt: new Date().toISOString(),
      }
      persistWishes([wish, ...loadWishes()])
    },
    [persistWishes],
  )

  const deleteWish = useCallback(
    (id: string) => {
      persistWishes(loadWishes().filter((w) => w.id !== id))
    },
    [persistWishes],
  )

  const getMemoriesByStage = useCallback(
    (stageId: StageId) =>
      memories
        .filter((m) => m.stageId === stageId)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [memories],
  )

  const getMemoryCount = useCallback(
    (stageId: StageId) => memories.filter((m) => m.stageId === stageId).length,
    [memories],
  )

  return {
    ready,
    memories,
    wishes,
    addMemory,
    deleteMemory,
    addWish,
    deleteWish,
    getMemoriesByStage,
    getMemoryCount,
  }
}
