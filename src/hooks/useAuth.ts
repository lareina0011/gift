import { useCallback, useEffect, useState } from 'react'
import {
  changePasswordApi,
  getCurrentRole,
  isAuthenticated,
  loginApi,
  setAuthenticated,
  verifySession,
} from '../api/client'
import { clearBlessingSession } from '../utils/blessingSession'
import { clearIntroSession } from '../utils/introMedia'
import { clearWelcomeUserSession } from '../utils/storage'
import type { UserRole } from '../types'

export function useAuth() {
  const [authed, setAuthed] = useState(isAuthenticated)
  const [currentUser, setCurrentUserState] = useState<string | null>(
    isAuthenticated() ? sessionStorage.getItem('gg-current-user') : null,
  )
  const [role, setRole] = useState<UserRole | null>(() => {
    const r = getCurrentRole()
    return r === 'editor' || r === 'viewer' ? r : null
  })
  const [checking, setChecking] = useState(isAuthenticated())

  useEffect(() => {
    if (!isAuthenticated()) {
      setChecking(false)
      return
    }

    verifySession().then((valid) => {
      setAuthed(valid)
      setCurrentUserState(valid ? sessionStorage.getItem('gg-current-user') : null)
      const r = getCurrentRole()
      setRole(valid && (r === 'editor' || r === 'viewer') ? r : null)
      setChecking(false)
    })
  }, [])

  const login = useCallback(async (username: string, password: string): Promise<{ ok: boolean; message?: string }> => {
    const result = await loginApi(username, password)
    if (result.ok) {
      setAuthed(true)
      setCurrentUserState(result.username)
      setRole(result.role === 'editor' || result.role === 'viewer' ? result.role : null)
      return { ok: true }
    }
    return { ok: false, message: result.message }
  }, [])

  const logout = useCallback(() => {
    clearIntroSession()
    clearWelcomeUserSession()
    clearBlessingSession()
    setAuthenticated(false)
    setAuthed(false)
    setCurrentUserState(null)
    setRole(null)
  }, [])

  const changePassword = useCallback(
    async (oldPassword: string, newPassword: string): Promise<{ ok: boolean; message: string }> => {
      if (!isAuthenticated()) {
        return { ok: false, message: '未登录' }
      }
      return changePasswordApi(oldPassword, newPassword)
    },
    [],
  )

  return {
    authed,
    checking,
    currentUser,
    role,
    isEditor: role === 'editor',
    login,
    logout,
    changePassword,
  }
}
