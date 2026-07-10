import { useCallback, useMemo, useState } from 'react'
import { AUTH_ACCOUNTS } from '../constants/config'
import { clearIntroSession } from '../utils/introMedia'
import {
  clearWelcomeUserSession,
  getCurrentUser,
  isAuthenticated,
  loadAccounts,
  saveAccounts,
  setAuthenticated,
  setCurrentUser,
} from '../utils/storage'

export function useAuth() {
  const [authed, setAuthed] = useState(isAuthenticated)
  const [accountsVersion, setAccountsVersion] = useState(0)

  const accounts = useMemo(
    () => loadAccounts(AUTH_ACCOUNTS),
    [accountsVersion],
  )

  const currentUser = authed ? getCurrentUser() : null

  const login = useCallback((username: string, password: string): boolean => {
    const list = loadAccounts(AUTH_ACCOUNTS)
    const account = list.find(
      (a) => a.username === username.trim() && a.password === password,
    )
    if (account) {
      setAuthenticated(true)
      setCurrentUser(account.username)
      setAuthed(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    clearIntroSession()
    clearWelcomeUserSession()
    setAuthenticated(false)
    setAuthed(false)
  }, [])

  const changePassword = useCallback(
    (oldPassword: string, newPassword: string): { ok: boolean; message: string } => {
      const username = getCurrentUser()
      if (!username) {
        return { ok: false, message: '未登录' }
      }

      const list = loadAccounts(AUTH_ACCOUNTS)
      const index = list.findIndex((a) => a.username === username)
      if (index === -1) {
        return { ok: false, message: '账号不存在' }
      }

      if (list[index].password !== oldPassword) {
        return { ok: false, message: '原密码不正确' }
      }

      if (newPassword.length < 6) {
        return { ok: false, message: '新密码至少 6 位' }
      }

      list[index] = { ...list[index], password: newPassword }
      saveAccounts(list)
      setAccountsVersion((v) => v + 1)
      return { ok: true, message: '密码修改成功' }
    },
    [],
  )

  return { authed, currentUser, accounts, login, logout, changePassword }
}
