import type { AuthAccount, FutureWish, Memory } from '../types'

const DB_NAME = 'graduation-gift-db'
const DB_VERSION = 1
const MEDIA_STORE = 'media'
const MEMORIES_KEY = 'gg-memories'
const WISHES_KEY = 'gg-wishes'
const AUTH_KEY = 'gg-auth'
const CURRENT_USER_KEY = 'gg-current-user'
const ACCOUNTS_KEY = 'gg-accounts'
const WELCOME_KEY = 'gg-welcome-seen'
const WELCOME_USER_SESSION_KEY = 'gg-welcome-user-session'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(MEDIA_STORE)) {
        db.createObjectStore(MEDIA_STORE)
      }
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function saveMediaBlob(key: string, blob: Blob): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, 'readwrite')
    tx.objectStore(MEDIA_STORE).put(blob, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getMediaBlob(key: string): Promise<Blob | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, 'readonly')
    const request = tx.objectStore(MEDIA_STORE).get(key)
    request.onsuccess = () => resolve((request.result as Blob) ?? null)
    request.onerror = () => reject(request.error)
  })
}

export async function deleteMediaBlob(key: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(MEDIA_STORE, 'readwrite')
    tx.objectStore(MEDIA_STORE).delete(key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadMemories(): Memory[] {
  return readJSON<Memory[]>(MEMORIES_KEY, [])
}

export function saveMemories(memories: Memory[]): void {
  writeJSON(MEMORIES_KEY, memories)
}

export function loadWishes(): FutureWish[] {
  return readJSON<FutureWish[]>(WISHES_KEY, [])
}

export function saveWishes(wishes: FutureWish[]): void {
  writeJSON(WISHES_KEY, wishes)
}

export function loadAccounts(defaultAccounts: AuthAccount[]): AuthAccount[] {
  const stored = readJSON<AuthAccount[] | null>(ACCOUNTS_KEY, null)
  if (!stored) {
    writeJSON(ACCOUNTS_KEY, defaultAccounts)
    return defaultAccounts
  }
  return stored
}

export function saveAccounts(accounts: AuthAccount[]): void {
  writeJSON(ACCOUNTS_KEY, accounts)
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true'
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, 'true')
  } else {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(CURRENT_USER_KEY)
  }
}

export function getCurrentUser(): string | null {
  return sessionStorage.getItem(CURRENT_USER_KEY)
}

export function setCurrentUser(username: string): void {
  sessionStorage.setItem(CURRENT_USER_KEY, username)
}

export function hasSeenWelcome(): boolean {
  return localStorage.getItem(WELCOME_KEY) === 'true'
}

export function markWelcomeSeen(): void {
  localStorage.setItem(WELCOME_KEY, 'true')
}

export function hasWelcomeUserThisSession(): boolean {
  return sessionStorage.getItem(WELCOME_USER_SESSION_KEY) === 'true'
}

export function markWelcomeUserThisSession(): void {
  sessionStorage.setItem(WELCOME_USER_SESSION_KEY, 'true')
}

export function clearWelcomeUserSession(): void {
  sessionStorage.removeItem(WELCOME_USER_SESSION_KEY)
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
