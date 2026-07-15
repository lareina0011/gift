import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createBlessing,
  deleteBlessingApi,
  fetchBlessings,
  updateBlessingApi,
} from '../api/data'
import type { StageBlessing, StageId } from '../types'

export function useStageBlessings() {
  const [blessings, setBlessings] = useState<StageBlessing[]>([])
  const [ready, setReady] = useState(false)

  const reload = useCallback(async () => {
    const list = await fetchBlessings()
    setBlessings(list)
  }, [])

  useEffect(() => {
    let cancelled = false
    fetchBlessings()
      .then((list) => {
        if (!cancelled) {
          setBlessings(list)
          setReady(true)
        }
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const getByStage = useCallback(
    (stageId: StageId) => blessings.filter((b) => b.stageId === stageId),
    [blessings],
  )

  const countByStage = useMemo(() => {
    const counts = {} as Record<StageId, number>
    for (const b of blessings) {
      counts[b.stageId] = (counts[b.stageId] ?? 0) + 1
    }
    return counts
  }, [blessings])

  const addBlessing = useCallback(
    async (data: {
      stageId: StageId
      friendName: string
      caption: string
      file: File
    }) => {
      const created = await createBlessing(data)
      setBlessings((prev) => [...prev, created].sort((a, b) => a.sortOrder - b.sortOrder))
      return created
    },
    [],
  )

  const updateBlessing = useCallback(
    async (id: string, data: { friendName?: string; caption?: string }) => {
      const updated = await updateBlessingApi(id, data)
      setBlessings((prev) => prev.map((b) => (b.id === id ? updated : b)))
      return updated
    },
    [],
  )

  const deleteBlessing = useCallback(async (id: string) => {
    await deleteBlessingApi(id)
    setBlessings((prev) => prev.filter((b) => b.id !== id))
  }, [])

  return {
    ready,
    blessings,
    getByStage,
    countByStage,
    addBlessing,
    updateBlessing,
    deleteBlessing,
    reload,
  }
}
