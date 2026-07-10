import { ImageIcon, RotateCcw, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import type { BackgroundImageType } from '../utils/backgroundImages'
import { FadeIn, SpotlightCard } from './reactbits'

interface BackgroundFieldProps {
  title: string
  description: string
  previewUrl: string | null
  hasCustom: boolean
  onUpload: (file: File) => Promise<{ ok: boolean; message: string }>
  onRemove: () => Promise<void>
}

function BackgroundField({
  title,
  description,
  previewUrl,
  hasCustom,
  onUpload,
  onRemove,
}: BackgroundFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const [busy, setBusy] = useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setMessage('')
    const result = await onUpload(file)
    setMessage(result.message)
    setSuccess(result.ok)
    setBusy(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleRemove = async () => {
    setBusy(true)
    setMessage('')
    await onRemove()
    setMessage('已恢复默认')
    setSuccess(true)
    setBusy(false)
  }

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium text-white/80">{title}</h4>
        <p className="mt-1 text-xs leading-relaxed text-white/35">{description}</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-black/30">
        {previewUrl ? (
          <img src={previewUrl} alt={title} className="aspect-[16/9] w-full object-cover" />
        ) : (
          <div className="flex aspect-[16/9] items-center justify-center text-white/20">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black transition hover:bg-white/90 disabled:opacity-50"
        >
          <Upload className="h-3.5 w-3.5" />
          上传图片
        </button>
        {hasCustom && (
          <button
            type="button"
            disabled={busy}
            onClick={handleRemove}
            className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-4 py-2 text-xs tracking-wider text-white/60 transition hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            恢复默认
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {message && (
        <p className={`text-xs ${success ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>
      )}
    </div>
  )
}

interface BackgroundSettingsProps {
  loginPreviewUrl: string | null
  heroPreviewUrl: string
  hasCustomLogin: boolean
  hasCustomHero: boolean
  uploadBackground: (type: BackgroundImageType, file: File) => Promise<{ ok: boolean; message: string }>
  removeBackground: (type: BackgroundImageType) => Promise<void>
}

export function BackgroundSettings({
  loginPreviewUrl,
  heroPreviewUrl,
  hasCustomLogin,
  hasCustomHero,
  uploadBackground,
  removeBackground,
}: BackgroundSettingsProps) {
  return (
    <FadeIn delay={0.15}>
      <SpotlightCard
        className="rounded-2xl border border-white/[0.06] bg-[#141414]/90 p-8 sm:p-10"
        spotlightColor="rgba(255,255,255,0.04)"
      >
        <h3 className="mb-2 flex items-center gap-2 text-base text-white/70">
          <ImageIcon className="h-4 w-4" />
          个性化背景
        </h3>
        <p className="mb-8 text-sm text-white/35">上传后会保留原有的光效与动画层</p>

        <div className="grid gap-10 md:grid-cols-2">
          <BackgroundField
            title="登录页背景"
            description="替换登录页底层图片，Plasma 光效仍会叠加在上方。"
            previewUrl={loginPreviewUrl}
            hasCustom={hasCustomLogin}
            onUpload={(file) => uploadBackground('login', file)}
            onRemove={() => removeBackground('login')}
          />

          <BackgroundField
            title="封面背景"
            description="替换首页封面底层图片，星空与山峦特效仍会保留。"
            previewUrl={heroPreviewUrl}
            hasCustom={hasCustomHero}
            onUpload={(file) => uploadBackground('hero', file)}
            onRemove={() => removeBackground('hero')}
          />
        </div>
      </SpotlightCard>
    </FadeIn>
  )
}
