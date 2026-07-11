import { useCallback, useEffect, useState } from 'react'
import type { FutureWish, Memory, StageId } from '../types'
import {
  createMemory,
  createWish,
  deleteMemoryApi,
  deleteWishApi,
  fetchMemories,
  fetchWishes,
} from '../api/data'

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [wishes, setWishes] = useState<FutureWish[]>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    Promise.all([fetchMemories(), fetchWishes()])
      .then(([nextMemories, nextWishes]) => {
        if (cancelled) return
        setMemories(nextMemories)
        setWishes(nextWishes)
        setReady(true)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err instanceof Error ? err.message : '加载失败')
        setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const addMemory = useCallback(
    async (
      stageId: StageId,
      data: { title: string; content: string; date: string; files: File[] },
    ) => {
      const memory = await createMemory(stageId, data)
      setMemories((prev) => [memory, ...prev])
      return memory
    },
    [],
  )

  const deleteMemory = useCallback(async (id: string) => {
    await deleteMemoryApi(id)
    setMemories((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const addWish = useCallback(async (text: string, emoji: string) => {
    const wish = await createWish(text, emoji)
    setWishes((prev) => [wish, ...prev])
  }, [])

  const deleteWish = useCallback(async (id: string) => {
    await deleteWishApi(id)
    setWishes((prev) => prev.filter((w) => w.id !== id))
  }, [])

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
    error,
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
