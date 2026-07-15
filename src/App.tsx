import { useAuth } from './hooks/useAuth'
import { LoginPage } from './components/LoginPage'
import { MainLayout } from './components/MainLayout'

export default function App() {
  const { authed, checking, currentUser, isEditor, login, logout, changePassword } = useAuth()

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f] text-white/40">
        加载中…
      </div>
    )
  }

  if (!authed) {
    return <LoginPage onLogin={login} />
  }

  return (
    <MainLayout
      currentUser={currentUser ?? ''}
      isEditor={isEditor}
      onLogout={logout}
      onChangePassword={changePassword}
    />
  )
}
