import { Camera, RotateCcw, User } from 'lucide-react'
import { useRef, useState } from 'react'
import { APP_ICONS } from '../constants/icons'
import { AppIcon } from './AppIcon'

interface ProfileAvatarProps {
  username: string
  avatarUrl: string | null
  hasCustomAvatar: boolean
  onUpload: (file: File) => Promise<{ ok: boolean; message: string }>
  onRemove: () => Promise<void>
  size?: 'md' | 'lg'
}

export function ProfileAvatar({
  avatarUrl,
  hasCustomAvatar,
  onUpload,
  onRemove,
  size = 'lg',
}: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const dim = size === 'lg' ? 'h-28 w-28 sm:h-32 sm:w-32' : 'h-16 w-16'

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

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={`profile-avatar-btn group relative ${dim} shrink-0 overflow-hidden rounded-full border-2 border-white/15 bg-white/[0.04] transition hover:border-fuchsia-400/40 disabled:opacity-60`}
        title="点击上传头像"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <AppIcon config={APP_ICONS.profile} size={size === 'lg' ? 40 : 28} className="text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
          <Camera className="h-6 w-6 text-white/90" />
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-sm bg-white/10 px-3 py-1.5 text-xs tracking-wider text-white/70 transition hover:bg-white/15 hover:text-white disabled:opacity-50"
        >
          <Camera className="h-3.5 w-3.5" />
          上传头像
        </button>
        {hasCustomAvatar && (
          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              await onRemove()
              setMessage('已恢复默认')
              setSuccess(true)
              setBusy(false)
            }}
            className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-3 py-1.5 text-xs tracking-wider text-white/50 transition hover:border-white/30 hover:text-white disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            恢复默认
          </button>
        )}
      </div>

      {message && (
        <p className={`text-xs ${success ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>
      )}

      {!hasCustomAvatar && !message && (
        <p className="flex items-center gap-1 text-[11px] text-white/25">
          <User className="h-3 w-3" />
          支持 JPG / PNG / WebP
        </p>
      )}
    </div>
  )
}
