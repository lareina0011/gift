import { motion } from 'framer-motion'
import { memo, useRef, useState } from 'react'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { APP_CONFIG } from '../constants/config'

interface LoginFormProps {
  onLogin: (username: string, password: string) => boolean
  onInputActivity?: (active: boolean) => void
}

export const LoginForm = memo(function LoginForm({
  onLogin,
  onInputActivity,
}: LoginFormProps) {
  const usernameRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<'username' | 'password' | null>(null)

  const handleFocus = (field: 'username' | 'password') => {
    setFocusedField(field)
    onInputActivity?.(true)
  }

  const handleBlur = () => {
    setFocusedField(null)
    requestAnimationFrame(() => {
      const active = document.activeElement
      const typing =
        active === usernameRef.current || active === passwordRef.current
      onInputActivity?.(typing)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const username = usernameRef.current?.value.trim() ?? ''
    const password = passwordRef.current?.value ?? ''

    if (!username || !password) {
      setError('请输入账号和密码')
      return
    }

    setError('')
    setLoading(true)

    const ok = onLogin(username, password)
    if (!ok) {
      setError('账号或密码不正确，请再试一次')
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-10 w-full max-w-[400px] px-4"
    >
      <div className="login-card relative overflow-hidden rounded-[1.35rem] p-px">
        <div className="relative rounded-[1.3rem] bg-[#0c0a12]/42 px-7 py-8 backdrop-blur-xl sm:px-9 sm:py-9">
          <div
            className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-12 h-36 w-36 rounded-full bg-violet-500/10 blur-3xl"
            aria-hidden
          />

          <header className="relative mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.55 }}
              className="login-brand"
            >
              {APP_CONFIG.siteTitle}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5 }}
              className="login-tagline"
            >
              {APP_CONFIG.loginSubtitle}
            </motion.p>
          </header>

          <form onSubmit={handleSubmit} className="relative space-y-5">
            <div>
              <label className="login-field-label">
                账号
              </label>
              <div
                className={`login-input-wrap ${focusedField === 'username' ? 'login-input-wrap--focused' : ''}`}
              >
                <User className="login-input-icon h-4 w-4" />
                <input
                  ref={usernameRef}
                  type="text"
                  name="username"
                  defaultValue=""
                  onFocus={() => handleFocus('username')}
                  onBlur={handleBlur}
                  placeholder="请输入账号"
                  autoComplete="username"
                  className="login-input"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="login-field-label">
                密码
              </label>
              <div
                className={`login-input-wrap ${focusedField === 'password' ? 'login-input-wrap--focused' : ''}`}
              >
                <Lock className="login-input-icon h-4 w-4" />
                <input
                  ref={passwordRef}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  defaultValue=""
                  onFocus={() => handleFocus('password')}
                  onBlur={handleBlur}
                  placeholder="请输入密码"
                  autoComplete="current-password"
                  className="login-input pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-white/25 transition hover:bg-white/5 hover:text-white/60"
                  tabIndex={-1}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-center text-sm text-rose-300/90"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01, y: loading ? 0 : -1 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="login-submit-btn relative mt-1 flex w-full items-center justify-center overflow-hidden rounded-xl py-3.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <span className="relative z-10">{loading ? '登录中…' : '登录'}</span>
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  )
})
