import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useState } from 'react'
import LoginBackground from './LoginBackground'

interface LoginPageProps {
  onLogin: (username: string, password: string) => boolean
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const ok = onLogin(username, password)
    if (!ok) {
      setError('账号或密码不正确，请再试一次')
      setLoading(false)
    }
  }

  const inputWrap =
    'rounded-xl border border-white/10 bg-white/[0.06] transition-[border-color,background-color] duration-150 focus-within:border-fuchsia-400/50 focus-within:bg-white/[0.1]'

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0a0a0f]">
      <LoginBackground />

      <div className="relative z-10 w-full max-w-[380px] px-4">
        <div className="rounded-2xl border border-white/10 bg-black/40 p-6 shadow-2xl sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <User className="h-3 w-3" />
                账号
              </label>
              <div className={inputWrap}>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入账号"
                  autoComplete="username"
                  className="w-full bg-transparent px-4 py-3.5 text-white placeholder:text-white/25 outline-none"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/40">
                <Lock className="h-3 w-3" />
                密码
              </label>
              <div className={`relative ${inputWrap}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  className="w-full bg-transparent px-4 py-3.5 pr-12 text-white placeholder:text-white/25 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/30 transition hover:text-white/60"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-center text-sm text-rose-400">{error}</p>}

            <button
              type="submit"
              disabled={!username.trim() || !password || loading}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-violet-500 py-3.5 font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
