import { useRef } from 'react'
import { useBackgroundImages } from '../hooks/useBackgroundImages'
import { DesignCredit } from './DesignCredit'
import LoginBackground from './LoginBackground'
import { LoginForm } from './LoginForm'

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const pausePlasmaRef = useRef(false)
  const { loginBgUrl, defaultLoginUrl } = useBackgroundImages()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <LoginBackground imageUrl={loginBgUrl ?? defaultLoginUrl} pauseRef={pausePlasmaRef} />
      <LoginForm
        onLogin={onLogin}
        onInputActivity={(active) => {
          pausePlasmaRef.current = active
        }}
      />
      <DesignCredit />
    </div>
  )
}
