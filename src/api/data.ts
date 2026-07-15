import { apiFetch, apiJson } from './client'
import type { FutureWish, Memory, SiteLetter, StageBlessing, LetterVoice } from '../types'

export async function fetchMemories(): Promise<Memory[]> {
  return apiJson<Memory[]>('/api/memories')
}

export async function createMemory(
  stageId: string,
  data: {
    title: string
    content: string
    date: string
    files: File[]
    unlockAt?: string | null
  },
): Promise<Memory> {
  const form = new FormData()
  form.append('stageId', stageId)
  form.append('title', data.title)
  form.append('content', data.content)
  form.append('date', data.date)
  form.append('unlockAt', data.unlockAt ?? '')
  for (const file of data.files) {
    form.append('files', file)
  }

  const res = await apiFetch('/api/memories', {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? '创建失败')
  }

  return res.json() as Promise<Memory>
}

export async function updateMemory(
  id: string,
  data: {
    title: string
    content: string
    date: string
    files: File[]
    removeMediaIds: string[]
    unlockAt?: string | null
  },
): Promise<Memory> {
  const form = new FormData()
  form.append('title', data.title)
  form.append('content', data.content)
  form.append('date', data.date)
  form.append('unlockAt', data.unlockAt ?? '')
  form.append('removeMediaIds', JSON.stringify(data.removeMediaIds))
  for (const file of data.files) {
    form.append('files', file)
  }

  const res = await apiFetch(`/api/memories/${id}`, {
    method: 'PATCH',
    body: form,
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? '更新失败')
  }

  return res.json() as Promise<Memory>
}

export async function deleteMemoryApi(id: string): Promise<void> {
  await apiJson(`/api/memories/${id}`, { method: 'DELETE' })
}

export async function fetchWishes(): Promise<FutureWish[]> {
  return apiJson<FutureWish[]>('/api/wishes')
}

export async function createWish(text: string, emoji: string): Promise<FutureWish> {
  return apiJson<FutureWish>('/api/wishes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, emoji }),
  })
}

export async function updateWishApi(
  id: string,
  text: string,
  emoji: string,
): Promise<FutureWish> {
  return apiJson<FutureWish>(`/api/wishes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, emoji }),
  })
}

export async function deleteWishApi(id: string): Promise<void> {
  await apiJson(`/api/wishes/${id}`, { method: 'DELETE' })
}

export async function fetchBlessings(stageId?: string): Promise<StageBlessing[]> {
  const q = stageId ? `?stageId=${encodeURIComponent(stageId)}` : ''
  return apiJson<StageBlessing[]>(`/api/blessings${q}`)
}

export async function createBlessing(data: {
  stageId: string
  friendName: string
  caption: string
  file: File
}): Promise<StageBlessing> {
  const form = new FormData()
  form.append('stageId', data.stageId)
  form.append('friendName', data.friendName)
  form.append('caption', data.caption)
  form.append('file', data.file)

  const res = await apiFetch('/api/blessings', {
    method: 'POST',
    body: form,
  })

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? '上传失败')
  }

  return res.json() as Promise<StageBlessing>
}

export async function updateBlessingApi(
  id: string,
  data: { friendName?: string; caption?: string },
): Promise<StageBlessing> {
  return apiJson<StageBlessing>(`/api/blessings/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
}

export async function deleteBlessingApi(id: string): Promise<void> {
  await apiJson(`/api/blessings/${id}`, { method: 'DELETE' })
}

export async function fetchLetter(): Promise<SiteLetter> {
  return apiJson<SiteLetter>('/api/letter')
}

export async function updateLetterApi(title: string, body: string): Promise<SiteLetter> {
  return apiJson<SiteLetter>('/api/letter', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, body }),
  })
}

export async function createLetterVoice(file: File, label: string): Promise<LetterVoice> {
  const form = new FormData()
  form.append('file', file)
  form.append('label', label)
  const res = await apiFetch('/api/letter/voices', { method: 'POST', body: form })
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string }
    throw new Error(err.error ?? '上传失败')
  }
  return res.json() as Promise<LetterVoice>
}

export async function deleteLetterVoiceApi(id: string): Promise<void> {
  await apiJson(`/api/letter/voices/${id}`, { method: 'DELETE' })
}
