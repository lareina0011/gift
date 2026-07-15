import { ImageIcon, Upload } from 'lucide-react'
import { useRef, useState } from 'react'
import { STAGES } from '../constants/stages'
import type { StageId } from '../types'
import { FadeIn, SpotlightCard } from './reactbits'

interface StageAssetSettingsProps {
  bgUrls: Partial<Record<StageId, string>>
  iconUrls: Partial<Record<StageId, string>>
  onUploadBg: (stageId: StageId, file: File) => Promise<{ ok: boolean; message: string }>
  onRemoveBg: (stageId: StageId) => Promise<void>
  onUploadIcon: (stageId: StageId, file: File) => Promise<{ ok: boolean; message: string }>
  onRemoveIcon: (stageId: StageId) => Promise<void>
  onUploadBgm: (file: File) => Promise<{ ok: boolean; message: string }>
  onRemoveBgm: () => Promise<void>
  hasBgm: boolean
  bgmUrl: string | null
}

export function StageAssetSettings({
  bgUrls,
  iconUrls,
  onUploadBg,
  onRemoveBg,
  onUploadIcon,
  onRemoveIcon,
  onUploadBgm,
  onRemoveBgm,
  hasBgm,
  bgmUrl,
}: StageAssetSettingsProps) {
  const [stageId, setStageId] = useState<StageId>('primary')
  const [message, setMessage] = useState('')
  const [ok, setOk] = useState(false)
  const bgRef = useRef<HTMLInputElement>(null)
  const iconRef = useRef<HTMLInputElement>(null)
  const bgmRef = useRef<HTMLInputElement>(null)

  const run = async (fn: () => Promise<{ ok: boolean; message: string } | void>) => {
    setMessage('')
    const result = await fn()
    if (result && 'ok' in result) {
      setOk(result.ok)
      setMessage(result.message)
    } else {
      setOk(true)
      setMessage('已更新')
    }
  }

  return (
    <FadeIn delay={0.15}>
      <SpotlightCard
        className="space-y-8 rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-8"
        spotlightColor="rgba(255,255,255,0.04)"
      >
        <div>
          <h3 className="mb-2 flex items-center gap-2 text-base text-white/70">
            <ImageIcon className="h-4 w-4" />
            阶段背景与图标
          </h3>
          <p className="mb-4 text-sm text-white/35">为每个阶段定制氛围背景和小图标</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {STAGES.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStageId(s.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs ${
                  stageId === s.id
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-white/[0.06] text-white/45'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
              <p className="mb-2 text-xs text-white/40">阶段背景</p>
              <div className="mb-3 aspect-video overflow-hidden rounded-lg bg-black/40">
                {bgUrls[stageId] ? (
                  <img src={bgUrls[stageId]} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/20">未设置</div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => bgRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-sm bg-white px-3 py-1.5 text-xs font-semibold text-black"
                >
                  <Upload className="h-3 w-3" />
                  上传
                </button>
                {bgUrls[stageId] && (
                  <button
                    type="button"
                    onClick={() => run(async () => { await onRemoveBg(stageId) })}
                    className="rounded-sm border border-white/15 px-3 py-1.5 text-xs text-white/50"
                  >
                    移除
                  </button>
                )}
              </div>
              <input
                ref={bgRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) run(() => onUploadBg(stageId, file))
                  e.target.value = ''
                }}
              />
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-black/20 p-3">
              <p className="mb-2 text-xs text-white/40">阶段图标</p>
              <div className="mb-3 flex aspect-video items-center justify-center rounded-lg bg-black/40">
                {iconUrls[stageId] ? (
                  <img src={iconUrls[stageId]} alt="" className="h-16 w-16 object-contain" />
                ) : (
                  <span className="text-xs text-white/20">未设置</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => iconRef.current?.click()}
                  className="inline-flex items-center gap-1 rounded-sm bg-white px-3 py-1.5 text-xs font-semibold text-black"
                >
                  <Upload className="h-3 w-3" />
                  上传
                </button>
                {iconUrls[stageId] && (
                  <button
                    type="button"
                    onClick={() => run(async () => { await onRemoveIcon(stageId) })}
                    className="rounded-sm border border-white/15 px-3 py-1.5 text-xs text-white/50"
                  >
                    移除
                  </button>
                )}
              </div>
              <input
                ref={iconRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) run(() => onUploadIcon(stageId, file))
                  e.target.value = ''
                }}
              />
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6">
          <h4 className="text-sm text-white/70">浏览背景音乐</h4>
          <p className="mt-1 text-xs text-white/30">独立于登录开场音频，主界面可随时开关</p>
          <div className="mt-3 rounded-xl border border-white/[0.06] bg-black/20 p-4">
            {bgmUrl ? <audio controls src={bgmUrl} className="mb-3 w-full" /> : (
              <p className="mb-3 text-xs text-white/25">尚未上传</p>
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => bgmRef.current?.click()}
                className="rounded-sm bg-white px-3 py-1.5 text-xs font-semibold text-black"
              >
                上传 BGM
              </button>
              {hasBgm && (
                <button
                  type="button"
                  onClick={() => run(async () => { await onRemoveBgm() })}
                  className="rounded-sm border border-white/15 px-3 py-1.5 text-xs text-white/50"
                >
                  移除
                </button>
              )}
            </div>
            <input
              ref={bgmRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) run(() => onUploadBgm(file))
                e.target.value = ''
              }}
            />
          </div>
        </div>

        {message && (
          <p className={`text-xs ${ok ? 'text-emerald-400' : 'text-rose-400'}`}>{message}</p>
        )}
      </SpotlightCard>
    </FadeIn>
  )
}
