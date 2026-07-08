import { useAuth } from './hooks/useAuth'
import { LoginPage } from './components/LoginPage'
import { MainLayout } from './components/MainLayout'

export default function App() {
  const { authed, currentUser, login, logout, changePassword } = useAuth()

  if (!authed) {
    return <LoginPage onLogin={login} />
  }

  return (
    <MainLayout
      currentUser={currentUser ?? ''}
      onLogout={logout}
      onChangePassword={changePassword}
    />
  )
}
