import {
  ArrowLeft,
  Eye,
  EyeOff,
  Film,
  ImageIcon,
  Layers,
  Lock,
  Mail,
  Music,
  type LucideIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { BackgroundSettings } from './BackgroundSettings'
import { IntroMediaSettings } from './IntroMediaSettings'
import { LetterSettings } from './LetterSettings'
import { ProfileAvatar } from './ProfileAvatar'
import { StageAssetSettings } from './StageAssetSettings'
import { StageBlessingSettings } from './StageBlessingSettings'
import { FadeIn, SpotlightCard } from './reactbits'
import type { BackgroundImageType } from '../utils/backgroundImages'
import type { IntroMediaType } from '../utils/introMedia'
import type { SiteLetter, StageBlessing, StageId } from '../types'

type ProfileSection =
  | 'security'
  | 'letter'
  | 'intro'
  | 'background'
  | 'stageAssets'
  | 'blessings'

interface ProfilePanelProps {
  username: string
  isEditor: boolean
  onBack: () => void
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
  blessings: StageBlessing[]
  onAddBlessing: (data: {
    stageId: StageId
    friendName: string
    caption: string
    file: File
  }) => Promise<unknown>
  onDeleteBlessing: (id: string) => Promise<void>
  letter: SiteLetter | null
  onSaveLetter: (title: string, body: string) => Promise<unknown>
  onAddLetterVoice: (file: File, label: string) => Promise<unknown>
  onRemoveLetterVoice: (id: string) => Promise<void>
  stageBgUrls: Partial<Record<StageId, string>>
  stageIconUrls: Partial<Record<StageId, string>>
  onUploadStageBg: (stageId: StageId, file: File) => Promise<{ ok: boolean; message: string }>
  onRemoveStageBg: (stageId: StageId) => Promise<void>
  onUploadStageIcon: (stageId: StageId, file: File) => Promise<{ ok: boolean; message: string }>
  onRemoveStageIcon: (stageId: StageId) => Promise<void>
  hasBgm: boolean
  bgmUrl: string | null
  onUploadBgm: (file: File) => Promise<{ ok: boolean; message: string }>
  onRemoveBgm: () => Promise<void>
}

const BASE_SECTIONS: Array<{
  id: ProfileSection
  label: string
  description: string
  icon: LucideIcon
  editorOnly?: boolean
}> = [
  {
    id: 'security',
    label: '账号安全',
    description: '修改登录密码',
    icon: Lock,
  },
  {
    id: 'letter',
    label: '给你的信',
    description: '长信与语音留言',
    icon: Mail,
    editorOnly: true,
  },
  {
    id: 'blessings',
    label: '阶段寄语',
    description: '好友视频 · 仅开发账号',
    icon: Film,
    editorOnly: true,
  },
  {
    id: 'stageAssets',
    label: '阶段与 BGM',
    description: '背景、图标、背景音乐',
    icon: Layers,
    editorOnly: true,
  },
  {
    id: 'intro',
    label: '登录开场',
    description: '开场图片与音频',
    icon: Music,
    editorOnly: true,
  },
  {
    id: 'background',
    label: '个性化背景',
    description: '登录页与封面图',
    icon: ImageIcon,
    editorOnly: true,
  },
]

export function ProfilePanel({
  username,
  isEditor,
  onBack,
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
  blessings,
  onAddBlessing,
  onDeleteBlessing,
  letter,
  onSaveLetter,
  onAddLetterVoice,
  onRemoveLetterVoice,
  stageBgUrls,
  stageIconUrls,
  onUploadStageBg,
  onRemoveStageBg,
  onUploadStageIcon,
  onRemoveStageIcon,
  hasBgm,
  bgmUrl,
  onUploadBgm,
  onRemoveBgm,
}: ProfilePanelProps) {
  const sections = useMemo(
    () => BASE_SECTIONS.filter((s) => !s.editorOnly || isEditor),
    [isEditor],
  )
  const [section, setSection] = useState<ProfileSection>('security')

  useEffect(() => {
    if (!sections.some((s) => s.id === section)) {
      setSection('security')
    }
  }, [sections, section])
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
      <div className="mx-auto max-w-5xl space-y-8">
        <FadeIn>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-sm px-1 py-1.5 text-xs tracking-wider text-white/50 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </button>
        </FadeIn>

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
                  管理头像与各项个性化设置
                </p>
              </div>
            </div>
          </SpotlightCard>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start">
            {/* 移动端顶栏 Tab / 桌面侧栏 */}
            <nav
              aria-label="设置分类"
              className="flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:flex-col lg:overflow-visible lg:pb-0"
            >
              {sections.map((item) => {
                const active = section === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={`shrink-0 rounded-xl border px-4 py-3 text-left transition lg:w-full ${
                      active
                        ? 'border-white/20 bg-white/[0.08] text-white'
                        : 'border-white/[0.06] bg-[#141414]/60 text-white/55 hover:border-white/12 hover:bg-white/[0.04] hover:text-white/80'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 shrink-0 opacity-80" />
                      <span className="text-sm font-medium tracking-wide">{item.label}</span>
                    </span>
                    <span className="mt-1.5 hidden text-xs leading-relaxed text-white/30 lg:block">
                      {item.description}
                    </span>
                  </button>
                )
              })}
            </nav>

            <div className="min-w-0">
              {section === 'security' && (
                <SpotlightCard
                  className="rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-8"
                  spotlightColor="rgba(255,255,255,0.04)"
                >
                  <h3 className="mb-2 flex items-center gap-2 text-base text-white/70">
                    <Lock className="h-4 w-4" />
                    修改密码
                  </h3>
                  <p className="mb-6 text-sm text-white/35">更新后下次登录请使用新密码</p>

                  <form onSubmit={handleSubmit} className="mx-auto max-w-md space-y-5">
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
                          {showConfirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
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
              )}

              {section === 'letter' && isEditor && (
                <LetterSettings
                  letter={letter}
                  onSave={onSaveLetter}
                  onAddVoice={onAddLetterVoice}
                  onRemoveVoice={onRemoveLetterVoice}
                />
              )}

              {section === 'blessings' && isEditor && (
                <StageBlessingSettings
                  blessings={blessings}
                  onAdd={onAddBlessing}
                  onDelete={onDeleteBlessing}
                />
              )}

              {section === 'stageAssets' && isEditor && (
                <StageAssetSettings
                  bgUrls={stageBgUrls}
                  iconUrls={stageIconUrls}
                  onUploadBg={onUploadStageBg}
                  onRemoveBg={onRemoveStageBg}
                  onUploadIcon={onUploadStageIcon}
                  onRemoveIcon={onRemoveStageIcon}
                  onUploadBgm={onUploadBgm}
                  onRemoveBgm={onRemoveBgm}
                  hasBgm={hasBgm}
                  bgmUrl={bgmUrl}
                />
              )}

              {section === 'intro' && isEditor && (
                <IntroMediaSettings
                  imagePreviewUrl={introImagePreviewUrl}
                  audioPreviewUrl={introAudioPreviewUrl}
                  hasIntroImage={hasIntroImage}
                  hasCustomIntroAudio={hasCustomIntroAudio}
                  defaultIntroAudioUrl={defaultIntroAudioUrl}
                  uploadIntroMedia={uploadIntroMedia}
                  removeIntroMedia={removeIntroMedia}
                />
              )}

              {section === 'background' && isEditor && (
                <BackgroundSettings
                  loginPreviewUrl={loginPreviewUrl}
                  heroPreviewUrl={heroPreviewUrl}
                  hasCustomLogin={hasCustomLogin}
                  hasCustomHero={hasCustomHero}
                  uploadBackground={uploadBackground}
                  removeBackground={removeBackground}
                />
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
