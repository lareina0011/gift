import { useRef } from 'react'
import { useBackgroundImages } from '../hooks/useBackgroundImages'
import { DesignCredit } from './DesignCredit'
import LoginBackground from './LoginBackground'
import { LoginForm } from './LoginForm'
import { Particles } from './reactbits'

const LOGIN_PARTICLE_COLOR = '#7c3aed'

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const pauseParticlesRef = useRef(false)
  const { loginBgUrl, defaultLoginUrl } = useBackgroundImages()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <LoginBackground imageUrl={loginBgUrl ?? defaultLoginUrl} />

      <div className="pointer-events-none absolute inset-0 z-[5]" style={{ contain: 'strict' }}>
        <Particles
          particleCount={500}
          particleSpread={30}
          speed={0.1}
          particleColors={[LOGIN_PARTICLE_COLOR]}
          moveParticlesOnHover
          particleHoverFactor={1}
          alphaParticles
          particleBaseSize={200}
          disableRotation={false}
          maxDpr={1}
          pauseRef={pauseParticlesRef}
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <LoginForm
        onLogin={onLogin}
        onInputActivity={(active) => {
          pauseParticlesRef.current = active
        }}
      />
      <DesignCredit />
    </div>
  )
}
