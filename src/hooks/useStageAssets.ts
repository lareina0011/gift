import { useCallback, useEffect, useState } from 'react'
import { apiBlob, apiDelete, apiFetch } from '../api/client'
import { STAGES } from '../constants/stages'
import type { StageId } from '../types'

async function loadStageAsset(
  kind: 'stage-bg' | 'stage-icon',
  stageId: StageId,
): Promise<string | null> {
  const blob = await apiBlob(`/api/settings/${kind}/${stageId}`)
  return blob ? URL.createObjectURL(blob) : null
}

export function useStageAssets() {
  const [bgUrls, setBgUrls] = useState<Partial<Record<StageId, string>>>({})
  const [iconUrls, setIconUrls] = useState<Partial<Record<StageId, string>>>({})
  const [ready, setReady] = useState(false)

  const reload = useCallback(async () => {
    const nextBg: Partial<Record<StageId, string>> = {}
    const nextIcon: Partial<Record<StageId, string>> = {}

    await Promise.all(
      STAGES.map(async (stage) => {
        const [bg, icon] = await Promise.all([
          loadStageAsset('stage-bg', stage.id),
          loadStageAsset('stage-icon', stage.id),
        ])
        if (bg) nextBg[stage.id] = bg
        if (icon) nextIcon[stage.id] = icon
      }),
    )

    setBgUrls((prev) => {
      Object.values(prev).forEach((u) => u && URL.revokeObjectURL(u))
      return nextBg
    })
    setIconUrls((prev) => {
      Object.values(prev).forEach((u) => u && URL.revokeObjectURL(u))
      return nextIcon
    })
    setReady(true)
  }, [])

  useEffect(() => {
    reload()
    return () => {
      Object.values(bgUrls).forEach((u) => u && URL.revokeObjectURL(u))
      Object.values(iconUrls).forEach((u) => u && URL.revokeObjectURL(u))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- cleanup only on unmount
  }, [reload])

  const uploadStageBg = useCallback(async (stageId: StageId, file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await apiFetch(`/api/settings/stage-bg/${stageId}`, { method: 'POST', body: form })
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string }
      return { ok: false as const, message: err.error ?? '上传失败' }
    }
    await reload()
    return { ok: true as const, message: '阶段背景已更新' }
  }, [reload])

  const removeStageBg = useCallback(async (stageId: StageId) => {
    await apiDelete(`/api/settings/stage-bg/${stageId}`)
    await reload()
  }, [reload])

  const uploadStageIcon = useCallback(async (stageId: StageId, file: File) => {
    const form = new FormData()
    form.append('file', file)
    const res = await apiFetch(`/api/settings/stage-icon/${stageId}`, { method: 'POST', body: form })
    if (!res.ok) {
      const err = (await res.json().catch(() => ({}))) as { error?: string }
      return { ok: false as const, message: err.error ?? '上传失败' }
    }
    await reload()
    return { ok: true as const, message: '阶段图标已更新' }
  }, [reload])

  const removeStageIcon = useCallback(async (stageId: StageId) => {
    await apiDelete(`/api/settings/stage-icon/${stageId}`)
    await reload()
  }, [reload])

  return {
    ready,
    bgUrls,
    iconUrls,
    uploadStageBg,
    removeStageBg,
    uploadStageIcon,
    removeStageIcon,
  }
}
