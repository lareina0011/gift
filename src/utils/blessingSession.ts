import type { StageId } from '../types'

const PREFIX = 'gg-blessing-played:'

export function hasPlayedBlessingThisSession(stageId: StageId): boolean {
  return sessionStorage.getItem(`${PREFIX}${stageId}`) === '1'
}

export function markBlessingPlayedThisSession(stageId: StageId): void {
  sessionStorage.setItem(`${PREFIX}${stageId}`, '1')
}

export function clearBlessingSession(): void {
  const keys: string[] = []
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i)
    if (key?.startsWith(PREFIX)) keys.push(key)
  }
  for (const key of keys) sessionStorage.removeItem(key)
}
