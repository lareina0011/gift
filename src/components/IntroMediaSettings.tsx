import { ImageIcon, Music, RotateCcw, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import type { IntroMediaType } from '../utils/introMedia'
import { IntroAudioUpload } from './IntroAudioUpload'
import { FadeIn, SpotlightCard } from './reactbits'

interface IntroMediaSettingsProps {
  imagePreviewUrl: string | null
  audioPreviewUrl: string | null
  hasIntroImage: boolean
  hasCustomIntroAudio: boolean
  defaultIntroAudioUrl: string | null
  uploadIntroMedia: (type: IntroMediaType, file: File) => Promise<{ ok: boolean; message: string }>
  removeIntroMedia: (type: IntroMediaType) => Promise<void>
  compact?: boolean
}

function MediaMessage({ message, success }: { message: string; success: boolean }) {
  if (!message) return null
  return <p className={`text-xs ${success ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>
}

export function IntroMediaSettings({
  imagePreviewUrl,
  audioPreviewUrl,
  hasIntroImage,
  hasCustomIntroAudio,
  defaultIntroAudioUrl,
  uploadIntroMedia,
  removeIntroMedia,
}: IntroMediaSettingsProps) {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const [imageMessage, setImageMessage] = useState('')
  const [imageSuccess, setImageSuccess] = useState(false)
  const [imageBusy, setImageBusy] = useState(false)

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

  const handleAudio = (file: File) => uploadIntroMedia('audio', file)

  return (
    <FadeIn delay={0.2}>
      <SpotlightCard
        className="rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-8"
        spotlightColor="rgba(255,255,255,0.04)"
      >
        <h3 className="mb-2 flex items-center gap-2 text-base text-white/70">
          <Music className="h-4 w-4" />
          登录开场
        </h3>
        <p className="mb-8 text-sm text-white/35">
          登录后先播放图片与音频，音频结束后自动进入主界面
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
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

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-white/80">开场音频</h4>
              <p className="mt-1 text-xs text-white/35">
                支持 MP3、WAV、OGG、M4A；也可将文件命名为 intro_audio.mp3 放入 src/assets
              </p>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-black/30 p-4">
              {audioPreviewUrl ? (
                <audio controls src={audioPreviewUrl} className="w-full" />
              ) : (
                <div className="flex items-center justify-center gap-2 py-4 text-white/20">
                  <Music className="h-8 w-8" />
                  <span className="text-xs">暂无音频</span>
                </div>
              )}
            </div>

            <IntroAudioUpload onUpload={handleAudio} />

            {defaultIntroAudioUrl && !hasCustomIntroAudio && (
              <p className="text-xs text-white/30">当前使用 assets 中的默认开场音频</p>
            )}

            {hasCustomIntroAudio && (
              <button
                type="button"
                onClick={() => removeIntroMedia('audio')}
                className="inline-flex items-center gap-1.5 rounded-sm border border-white/15 px-4 py-2 text-xs tracking-wider text-white/60 transition hover:border-white/30 hover:text-white"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                移除已上传音频
              </button>
            )}
          </div>
        </div>
      </SpotlightCard>
    </FadeIn>
  )
}
