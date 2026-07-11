const TOKEN_KEY = 'gg-token'
const AUTH_KEY = 'gg-auth'
const CURRENT_USER_KEY = 'gg-current-user'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export function getToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(TOKEN_KEY)
  }
}

export function isAuthenticated(): boolean {
  return sessionStorage.getItem(AUTH_KEY) === 'true' && !!getToken()
}

export function setAuthenticated(value: boolean): void {
  if (value) {
    sessionStorage.setItem(AUTH_KEY, 'true')
  } else {
    sessionStorage.removeItem(AUTH_KEY)
    sessionStorage.removeItem(CURRENT_USER_KEY)
    setToken(null)
  }
}

export function getCurrentUser(): string | null {
  return sessionStorage.getItem(CURRENT_USER_KEY)
}

export function setCurrentUser(username: string): void {
  sessionStorage.setItem(CURRENT_USER_KEY, username)
}

async function parseError(res: Response): Promise<string> {
  try {
    const data = (await res.json()) as { error?: string }
    return data.error ?? '请求失败'
  } catch {
    return '请求失败'
  }
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  const token = getToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(path, { ...init, headers })
  if (res.status === 401 && getToken()) {
    setAuthenticated(false)
  }
  return res
}

export async function apiJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await apiFetch(path, init)
  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }
  return res.json() as Promise<T>
}

export async function apiBlob(path: string, init: RequestInit = {}): Promise<Blob | null> {
  const res = await apiFetch(path, init)
  if (res.status === 404) return null
  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }
  return res.blob()
}

export async function apiUpload(path: string, file: File, fieldName = 'file'): Promise<void> {
  const form = new FormData()
  form.append(fieldName, file)
  const res = await apiFetch(path, { method: 'POST', body: form })
  if (!res.ok) {
    throw new ApiError(res.status, await parseError(res))
  }
}

export async function apiDelete(path: string): Promise<void> {
  const res = await apiFetch(path, { method: 'DELETE' })
  if (!res.ok && res.status !== 404) {
    throw new ApiError(res.status, await parseError(res))
  }
}

export async function verifySession(): Promise<boolean> {
  try {
    await apiJson('/api/auth/me')
    return true
  } catch {
    setAuthenticated(false)
    return false
  }
}

interface LoginResponse {
  token: string
  user: { username: string; role: string }
}

export async function loginApi(
  username: string,
  password: string,
): Promise<{ ok: true; username: string } | { ok: false; message: string }> {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      return { ok: false, message: data.error ?? '账号或密码不正确' }
    }

    const data = (await res.json()) as LoginResponse
    setToken(data.token)
    setAuthenticated(true)
    setCurrentUser(data.user.username)
    return { ok: true, username: data.user.username }
  } catch {
    return { ok: false, message: '无法连接服务器，请确认后端已启动' }
  }
}

export async function changePasswordApi(
  oldPassword: string,
  newPassword: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    await apiJson('/api/auth/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldPassword, newPassword }),
    })
    return { ok: true, message: '密码修改成功' }
  } catch (err) {
    const message = err instanceof Error ? err.message : '修改失败'
    return { ok: false, message }
  }
}
