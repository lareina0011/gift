import { apiFetch, apiJson } from './client'
import type { FutureWish, Memory } from '../types'

export async function fetchMemories(): Promise<Memory[]> {
  return apiJson<Memory[]>('/api/memories')
}

export async function createMemory(
  stageId: string,
  data: { title: string; content: string; date: string; files: File[] },
): Promise<Memory> {
  const form = new FormData()
  form.append('stageId', stageId)
  form.append('title', data.title)
  form.append('content', data.content)
  form.append('date', data.date)
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

export async function deleteWishApi(id: string): Promise<void> {
  await apiJson(`/api/wishes/${id}`, { method: 'DELETE' })
}
