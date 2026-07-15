import { Mail, Trash2, Upload } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { mediaStreamUrl } from '../api/client'
import type { SiteLetter } from '../types'
import { FadeIn, SpotlightCard } from './reactbits'

interface LetterSettingsProps {
  letter: SiteLetter | null
  onSave: (title: string, body: string) => Promise<unknown>
  onAddVoice: (file: File, label: string) => Promise<unknown>
  onRemoveVoice: (id: string) => Promise<void>
}

export function LetterSettings({
  letter,
  onSave,
  onAddVoice,
  onRemoveVoice,
}: LetterSettingsProps) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [voiceLabel, setVoiceLabel] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!letter) return
    setTitle(letter.title)
    setBody(letter.body)
  }, [letter])

  const handleSave = async () => {
    setBusy(true)
    setMessage('')
    try {
      await onSave(title.trim() || '写给你的一封信', body)
      setOk(true)
      setMessage('信件已保存')
    } catch (err) {
      setOk(false)
      setMessage(err instanceof Error ? err.message : '保存失败')
    } finally {
      setBusy(false)
    }
  }

  const handleVoice = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    setMessage('')
    try {
      await onAddVoice(file, voiceLabel.trim())
      setVoiceLabel('')
      setOk(true)
      setMessage('语音已添加')
    } catch (err) {
      setOk(false)
      setMessage(err instanceof Error ? err.message : '上传失败')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <FadeIn delay={0.15}>
      <SpotlightCard
        className="rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-8"
        spotlightColor="rgba(255,255,255,0.04)"
      >
        <h3 className="mb-2 flex items-center gap-2 text-base text-white/70">
          <Mail className="h-4 w-4" />
          给你的信
        </h3>
        <p className="mb-6 text-sm text-white/35">
          写一封完整的长信，可附上多段语音留言。对方打开「一封信」即可阅读与收听。
        </p>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] tracking-wider text-white/35">标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={80}
              className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none focus:border-fuchsia-400/35"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] tracking-wider text-white/35">正文</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="w-full resize-y rounded-lg border border-white/10 bg-white/[0.03] px-3 py-3 font-serif text-sm leading-relaxed text-white outline-none focus:border-fuchsia-400/35"
            />
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={handleSave}
            className="rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black disabled:opacity-50"
          >
            保存信件
          </button>
        </div>

        <div className="mt-10 border-t border-white/[0.06] pt-8">
          <h4 className="text-sm text-white/70">语音留言</h4>
          <p className="mt-1 text-xs text-white/30">支持 MP3 / M4A / WAV，可多段</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <input
              value={voiceLabel}
              onChange={(e) => setVoiceLabel(e.target.value)}
              placeholder="备注（可选）"
              maxLength={40}
              className="min-w-[140px] flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white outline-none"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              上传语音
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => handleVoice(e.target.files?.[0])}
            />
          </div>

          <div className="mt-4 space-y-3">
            {(letter?.voices ?? []).map((voice) => (
              <div
                key={voice.id}
                className="rounded-xl border border-white/[0.06] bg-black/20 px-4 py-3"
              >
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-sm text-white/55">{voice.label || '未命名留言'}</p>
                  <button
                    type="button"
                    onClick={() => onRemoveVoice(voice.id)}
                    className="rounded-lg p-1.5 text-white/30 transition hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <audio controls src={mediaStreamUrl(voice.blobKey)} className="w-full" />
              </div>
            ))}
          </div>
        </div>

        {message && (
          <p className={`mt-4 text-xs ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>{message}</p>
        )}
      </SpotlightCard>
    </FadeIn>
  )
}
