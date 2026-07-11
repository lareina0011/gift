import { Eye, EyeOff, Lock } from 'lucide-react'
import { useState } from 'react'
import { BackgroundSettings } from './BackgroundSettings'
import { IntroMediaSettings } from './IntroMediaSettings'
import { ProfileAvatar } from './ProfileAvatar'
import { FadeIn, SpotlightCard } from './reactbits'
import type { BackgroundImageType } from '../utils/backgroundImages'
import type { IntroMediaType } from '../utils/introMedia'

interface ProfilePanelProps {
  username: string
  avatarUrl: string | null
  hasCustomAvatar: boolean
  uploadAvatar: (file: File) => Promise<{ ok: boolean; message: string }>
  removeAvatar: () => Promise<void>
  onChangePassword: (
    oldPassword: string,
    newPassword: string,
  ) => Promise<{ ok: boolean; message: string }>
  loginPreviewUrl: string | null
  heroPreviewUrl: string
  hasCustomLogin: boolean
  hasCustomHero: boolean
  uploadBackground: (type: BackgroundImageType, file: File) => Promise<{ ok: boolean; message: string }>
  removeBackground: (type: BackgroundImageType) => Promise<void>
  introImagePreviewUrl: string | null
  introAudioPreviewUrl: string | null
  hasIntroImage: boolean
  hasCustomIntroAudio: boolean
  defaultIntroAudioUrl: string | null
  uploadIntroMedia: (type: IntroMediaType, file: File) => Promise<{ ok: boolean; message: string }>
  removeIntroMedia: (type: IntroMediaType) => Promise<void>
}

export function ProfilePanel({
  username,
  avatarUrl,
  hasCustomAvatar,
  uploadAvatar,
  removeAvatar,
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
  hasCustomIntroAudio,
  defaultIntroAudioUrl,
  uploadIntroMedia,
  removeIntroMedia,
}: ProfilePanelProps) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setMessage('两次输入的新密码不一致')
      return
    }

    const result = await onChangePassword(oldPassword, newPassword)
    setMessage(result.message)
    setSuccess(result.ok)

    if (result.ok) {
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const inputClass =
    'w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-white outline-none transition placeholder:text-white/20 focus:border-fuchsia-400/35 focus:bg-white/[0.05]'

  return (
    <div className="page-shell flex-1 overflow-y-auto pb-24 pt-24">
      <div className="mx-auto max-w-5xl space-y-10">
        <FadeIn>
          <SpotlightCard
            className="rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-8 sm:p-10"
            spotlightColor="rgba(255,255,255,0.05)"
          >
            <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12">
              <ProfileAvatar
                username={username}
                avatarUrl={avatarUrl}
                hasCustomAvatar={hasCustomAvatar}
                onUpload={uploadAvatar}
                onRemove={removeAvatar}
              />
              <div className="text-center sm:text-left">
                <p className="text-[11px] tracking-[0.32em] text-white/35">MY PROFILE</p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">我的</h2>
                <p className="profile-username mt-3 text-3xl sm:text-4xl">{username}</p>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-white/30">
                  管理头像、密码与个性化开场内容
                </p>
              </div>
            </div>
          </SpotlightCard>
        </FadeIn>

        <div className="grid gap-10 xl:grid-cols-2">
          <FadeIn delay={0.08}>
            <SpotlightCard
              className="h-full rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-8"
              spotlightColor="rgba(255,255,255,0.04)"
            >
              <h3 className="mb-6 flex items-center gap-2 text-base text-white/70">
                <Lock className="h-4 w-4" />
                修改密码
              </h3>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-xs tracking-[0.18em] text-white/35">
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
                  <label className="mb-2 block text-xs tracking-[0.18em] text-white/35">
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
                  <label className="mb-2 block text-xs tracking-[0.18em] text-white/35">
                    确认新密码
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${inputClass} pr-12`}
                      placeholder="再次输入新密码"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {message && (
                  <p className={`text-sm ${success ? 'text-emerald-400' : 'text-red-400'}`}>
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-white py-3.5 text-sm font-semibold tracking-wider text-black transition hover:bg-white/90"
                >
                  保存新密码
                </button>
              </form>
            </SpotlightCard>
          </FadeIn>

          <div className="space-y-10">
            <IntroMediaSettings
              imagePreviewUrl={introImagePreviewUrl}
              audioPreviewUrl={introAudioPreviewUrl}
              hasIntroImage={hasIntroImage}
              hasCustomIntroAudio={hasCustomIntroAudio}
              defaultIntroAudioUrl={defaultIntroAudioUrl}
              uploadIntroMedia={uploadIntroMedia}
              removeIntroMedia={removeIntroMedia}
            />
          </div>
        </div>

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
