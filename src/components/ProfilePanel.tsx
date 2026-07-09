import { Eye, EyeOff, Lock, User } from 'lucide-react'
import { useState } from 'react'
import { APP_ICONS } from '../constants/icons'
import { AppIcon } from './AppIcon'
import { BackgroundSettings } from './BackgroundSettings'
import { IntroMediaSettings } from './IntroMediaSettings'
import { FadeIn, SpotlightCard } from './reactbits'
import type { BackgroundImageType } from '../utils/backgroundImages'
import type { IntroMediaType } from '../utils/introMedia'

interface ProfilePanelProps {
  username: string
  onChangePassword: (
    oldPassword: string,
    newPassword: string,
  ) => { ok: boolean; message: string }
  loginPreviewUrl: string | null
  heroPreviewUrl: string
  hasCustomLogin: boolean
  hasCustomHero: boolean
  uploadBackground: (type: BackgroundImageType, file: File) => Promise<{ ok: boolean; message: string }>
  removeBackground: (type: BackgroundImageType) => Promise<void>
  introImagePreviewUrl: string | null
  introAudioPreviewUrl: string | null
  hasIntroImage: boolean
  hasIntroAudio: boolean
  uploadIntroMedia: (type: IntroMediaType, file: File) => Promise<{ ok: boolean; message: string }>
  removeIntroMedia: (type: IntroMediaType) => Promise<void>
}

export function ProfilePanel({
  username,
  onChangePassword,
  loginPreviewUrl,
  heroPreviewUrl,
  hasCustomLogin,
  hasCustomHero,
  uploadBackground,
  removeBackground,
  introImagePreviewUrl,
  introAudioPreviewUrl,
  hasIntroImage,
  hasIntroAudio,
  uploadIntroMedia,
  removeIntroMedia,
}: ProfilePanelProps) {
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
    'w-full rounded-sm border border-white/10 bg-white/[0.03] px-4 py-3 text-white outline-none transition placeholder:text-white/20 focus:border-white/25'

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
      <div className="mx-auto max-w-md">
        <FadeIn>
          <SpotlightCard
            className="mb-6 rounded-xl border border-white/[0.06] bg-[#141414] p-6"
            spotlightColor="rgba(255,255,255,0.05)"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
                <AppIcon config={APP_ICONS.profile} size={28} className="text-white/60" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-white">我的</h2>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-white/40">
                  <User className="h-3.5 w-3.5" />
                  {username}
                </p>
              </div>
            </div>
          </SpotlightCard>
        </FadeIn>

        <FadeIn delay={0.1}>
          <SpotlightCard
            className="rounded-xl border border-white/[0.06] bg-[#141414] p-6"
            spotlightColor="rgba(255,255,255,0.04)"
          >
            <h3 className="mb-4 flex items-center gap-2 text-sm text-white/60">
              <Lock className="h-4 w-4" />
              修改密码
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs tracking-wider text-white/35">
                  原密码
                </label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showOld ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs tracking-wider text-white/35">
                  新密码
                </label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                  >
                    {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs tracking-wider text-white/35">
                  确认新密码
                </label>
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
                <p className={`text-sm ${success ? 'text-emerald-400' : 'text-red-400'}`}>
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-sm bg-white py-3 text-xs font-semibold tracking-wider text-black transition hover:bg-white/90"
              >
                保存新密码
              </button>
            </form>
          </SpotlightCard>
        </FadeIn>

        <IntroMediaSettings
          imagePreviewUrl={introImagePreviewUrl}
          audioPreviewUrl={introAudioPreviewUrl}
          hasIntroImage={hasIntroImage}
          hasIntroAudio={hasIntroAudio}
          uploadIntroMedia={uploadIntroMedia}
          removeIntroMedia={removeIntroMedia}
        />

        <BackgroundSettings
          loginPreviewUrl={loginPreviewUrl}
          heroPreviewUrl={heroPreviewUrl}
          hasCustomLogin={hasCustomLogin}
          hasCustomHero={hasCustomHero}
          uploadBackground={uploadBackground}
          removeBackground={removeBackground}
        />
      </div>
    </div>
  )
}
