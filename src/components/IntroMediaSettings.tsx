import { ImageIcon, Music, RotateCcw, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import type { IntroMediaType } from '../utils/introMedia'
import { FadeIn, SpotlightCard } from './reactbits'

interface IntroMediaSettingsProps {
  imagePreviewUrl: string | null
  audioPreviewUrl: string | null
  hasIntroImage: boolean
  hasIntroAudio: boolean
  uploadIntroMedia: (type: IntroMediaType, file: File) => Promise<{ ok: boolean; message: string }>
  removeIntroMedia: (type: IntroMediaType) => Promise<void>
}

function MediaMessage({ message, success }: { message: string; success: boolean }) {
  if (!message) return null
  return <p className={`text-xs ${success ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>
}

export function IntroMediaSettings({
  imagePreviewUrl,
  audioPreviewUrl,
  hasIntroImage,
  hasIntroAudio,
  uploadIntroMedia,
  removeIntroMedia,
}: IntroMediaSettingsProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)
  const [imageMessage, setImageMessage] = useState('')
  const [imageSuccess, setImageSuccess] = useState(false)
  const [audioMessage, setAudioMessage] = useState('')
  const [audioSuccess, setAudioSuccess] = useState(false)
  const [imageBusy, setImageBusy] = useState(false)
  const [audioBusy, setAudioBusy] = useState(false)

  const handleImage = async (file: File | undefined) => {
    if (!file) return
    setImageBusy(true)
    setImageMessage('')
    const result = await uploadIntroMedia('image', file)
    setImageMessage(result.message)
    setImageSuccess(result.ok)
    setImageBusy(false)
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  const handleAudio = async (file: File | undefined) => {
    if (!file) return
    setAudioBusy(true)
    setAudioMessage('')
    const result = await uploadIntroMedia('audio', file)
    setAudioMessage(result.message)
    setAudioSuccess(result.ok)
    setAudioBusy(false)
    if (audioInputRef.current) audioInputRef.current.value = ''
  }

  return (
    <FadeIn delay={0.2}>
      <SpotlightCard
        className="mt-6 rounded-xl border border-white/[0.06] bg-[#141414] p-6"
        spotlightColor="rgba(255,255,255,0.04)"
      >
        <h3 className="mb-1 flex items-center gap-2 text-sm text-white/60">
          <Music className="h-4 w-4" />
          登录开场
        </h3>
        <p className="mb-6 text-xs text-white/30">
          登录后先播放图片与音频，音频结束后自动进入主界面
        </p>

        <div className="space-y-8">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-white/80">开场图片</h4>
              <p className="mt-1 text-xs text-white/35">建议横图，比例 16:9 左右</p>
            </div>
            <div className="overflow-hidden rounded-lg border border-white/[0.08] bg-black/30">
              {imagePreviewUrl ? (
                <img src={imagePreviewUrl} alt="开场图片" className="aspect-[16/9] w-full object-cover" />
              ) : (
                <div className="flex aspect-[16/9] flex-col items-center justify-center gap-2 text-white/20">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-xs">图片位 · 待上传</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={imageBusy}
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                上传图片
              </button>
              {hasIntroImage && (
                <button
                  type="button"
                  disabled={imageBusy}
                  onClick={async () => {
                    setImageBusy(true)
                    await removeIntroMedia('image')
                    setImageMessage('已移除')
                    setImageSuccess(true)
                    setImageBusy(false)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-4 py-2 text-xs tracking-wider text-white/60 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  移除
                </button>
              )}
            </div>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => handleImage(e.target.files?.[0])}
            />
            <MediaMessage message={imageMessage} success={imageSuccess} />
          </div>

          <div className="h-px bg-white/[0.06]" />

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-white/80">开场音频</h4>
              <p className="mt-1 text-xs text-white/35">支持 MP3、WAV、OGG、M4A，播完后自动进入</p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-black/30 p-4">
              {audioPreviewUrl ? (
                <audio controls src={audioPreviewUrl} className="w-full" />
              ) : (
                <div className="flex items-center justify-center gap-2 py-6 text-white/20">
                  <Music className="h-8 w-8" />
                  <span className="text-xs">音频位 · 待上传</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={audioBusy}
                onClick={() => audioInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black transition hover:bg-white/90 disabled:opacity-50"
              >
                <Upload className="h-3.5 w-3.5" />
                上传音频
              </button>
              {hasIntroAudio && (
                <button
                  type="button"
                  disabled={audioBusy}
                  onClick={async () => {
                    setAudioBusy(true)
                    await removeIntroMedia('audio')
                    setAudioMessage('已移除')
                    setAudioSuccess(true)
                    setAudioBusy(false)
                  }}
                  className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-4 py-2 text-xs tracking-wider text-white/60 transition hover:border-white/30 hover:text-white disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  移除
                </button>
              )}
            </div>
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/mpeg,audio/mp3,audio/wav,audio/ogg,audio/mp4,audio/x-m4a,audio/aac,.mp3,.wav,.ogg,.m4a,.aac"
              className="hidden"
              onChange={(e) => handleAudio(e.target.files?.[0])}
            />
            <MediaMessage message={audioMessage} success={audioSuccess} />
          </div>
        </div>
      </SpotlightCard>
    </FadeIn>
  )
}
