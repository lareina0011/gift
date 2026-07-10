import { Music, Upload } from 'lucide-react'
import { useRef, useState } from 'react'

interface IntroAudioUploadProps {
  onUpload: (file: File) => Promise<{ ok: boolean; message: string }>
  compact?: boolean
  className?: string
}

export function IntroAudioUpload({ onUpload, compact = false, className = '' }: IntroAudioUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

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
    <div className={className}>
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={`intro-audio-upload flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed transition disabled:opacity-50 ${
          compact
            ? 'border-white/15 bg-white/[0.02] px-4 py-3 hover:border-fuchsia-400/35 hover:bg-white/[0.04]'
            : 'border-white/12 bg-white/[0.02] py-8 hover:border-fuchsia-400/35 hover:bg-white/[0.04]'
        }`}
      >
        <div className="flex items-center gap-2 text-white/45">
          {busy ? (
            <span className="text-sm">上传中…</span>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <Music className="h-4 w-4" />
              <span className={compact ? 'text-xs' : 'text-sm'}>点击上传开场音频</span>
            </>
          )}
        </div>
        {!compact && (
          <span className="text-[11px] text-white/25">MP3 · WAV · OGG · M4A</span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,audio/x-m4a,audio/aac,.mp3,.wav,.ogg,.m4a,.aac"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {message && (
        <p className={`mt-2 text-center text-xs ${success ? 'text-emerald-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  )
}
