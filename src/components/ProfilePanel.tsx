import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { APP_ICONS } from '../constants/icons'
import { AppIcon } from './AppIcon'
import { FadeIn, SpotlightCard } from './reactbits'

interface ProfilePanelProps {
  username: string
  onChangePassword: (
    oldPassword: string,
    newPassword: string,
  ) => { ok: boolean; message: string }
}

export function ProfilePanel({ username, onChangePassword }: ProfilePanelProps) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setMessage('两次输入的新密码不一致')
      return
    }

    const result = onChangePassword(oldPassword, newPassword)
    setMessage(result.message)
    setSuccess(result.ok)

    if (result.ok) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-stone-800 outline-none transition focus:border-violet-300 focus:ring-2 focus:ring-violet-100'

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
      <div className="mx-auto max-w-md">
        <FadeIn>
          <SpotlightCard
            className="mb-6 rounded-2xl bg-gradient-to-br from-violet-400/15 to-rose-400/15 p-6"
            spotlightColor="rgba(167, 139, 250, 0.2)"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <AppIcon config={APP_ICONS.profile} size={28} className="text-violet-500" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-stone-800">我的</h2>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-stone-500">
                  <User className="h-3.5 w-3.5" />
                  {username}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SpotlightCard
            className="rounded-2xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm"
            spotlightColor="rgba(196, 132, 252, 0.12)"
          >
            <h3 className="mb-4 flex items-center gap-2 font-medium text-stone-700">
              <Lock className="h-4 w-4" />
              修改密码
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-stone-500">原密码</label>
                <div className="relative">
                  <input
                    type={showOld ? 'text' : 'password'}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                    placeholder="请输入原密码"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld(!showOld)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-stone-500">新密码</label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`${inputClass} pr-12`}
                    placeholder="至少 6 位"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm text-stone-500">确认新密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="再次输入新密码"
                  required
                />
              </div>

              {message && (
                <p className={`text-sm ${success ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-rose-400 py-3 font-medium text-white transition hover:opacity-90"
              >
                保存新密码
              </button>
            </form>
          </SpotlightCard>
        </FadeIn>
      </div>
    </div>
  )
}
