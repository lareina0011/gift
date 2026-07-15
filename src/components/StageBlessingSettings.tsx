import { Film, Trash2, Upload } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { mediaStreamUrl } from '../api/client'
import { STAGES } from '../constants/stages'
import type { StageBlessing, StageId } from '../types'
import { FadeIn, SpotlightCard } from './reactbits'

interface StageBlessingSettingsProps {
  blessings: StageBlessing[]
  onAdd: (data: {
    stageId: StageId
    friendName: string
    caption: string
    file: File
  }) => Promise<unknown>
  onDelete: (id: string) => Promise<void>
}

const MAX_VIDEO_MB = 100

export function StageBlessingSettings({
  blessings,
  onAdd,
  onDelete,
}: StageBlessingSettingsProps) {
  const [stageId, setStageId] = useState<StageId>('primary')
  const [friendName, setFriendName] = useState('')
  const [caption, setCaption] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const list = useMemo(
    () =>
      blessings
        .filter((b) => b.stageId === stageId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [blessings, stageId],
  )

  const handleUpload = async (file: File | undefined) => {
    if (!file) return
    setMessage('')
    setSuccess(false)

    if (!file.type.startsWith('video/')) {
      setMessage('请上传视频文件')
      return
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setMessage(`视频请小于 ${MAX_VIDEO_MB}MB`)
      return
    }

    setBusy(true)
    try {
      await onAdd({
        stageId,
        friendName: friendName.trim(),
        caption: caption.trim(),
        file,
      })
      setFriendName('')
      setCaption('')
      setMessage('已添加')
      setSuccess(true)
    } catch (err) {
      setMessage(err instanceof Error ? err.message : '上传失败')
      setSuccess(false)
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <FadeIn delay={0.2}>
      <SpotlightCard
        className="rounded-2xl border border-white/[0.06] bg-[#141414]/80 p-8"
        spotlightColor="rgba(255,255,255,0.04)"
      >
        <h3 className="mb-2 flex items-center gap-2 text-base text-white/70">
          <Film className="h-4 w-4" />
          阶段好友寄语
        </h3>
        <p className="mb-6 text-sm text-white/35">
          切换到某一阶段时，转场结束后会依次播放该阶段的视频。可随时慢慢补充。
        </p>

        <div className="mb-6 flex flex-wrap gap-2">
          {STAGES.map((s) => {
            const count = blessings.filter((b) => b.stageId === s.id).length
            const active = stageId === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStageId(s.id)}
                className={`rounded-lg border px-3 py-1.5 text-xs tracking-wide transition ${
                  active
                    ? 'border-white/25 bg-white/10 text-white'
                    : 'border-white/[0.06] text-white/45 hover:border-white/15 hover:text-white/75'
                }`}
              >
                {s.label}
                {count > 0 && <span className="ml-1.5 text-white/35">{count}</span>}
              </button>
            )
          })}
        </div>

        <div className="mb-8 space-y-3 rounded-xl border border-white/[0.06] bg-black/20 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[11px] tracking-wider text-white/35">
                朋友称呼（可选）
              </label>
              <input
                value={friendName}
                onChange={(e) => setFriendName(e.target.value)}
                maxLength={40}
                placeholder="例如：小雨"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-fuchsia-400/35"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] tracking-wider text-white/35">
                短备注（可选）
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={120}
                placeholder="例如：小学同桌"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/20 focus:border-fuchsia-400/35"
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-sm bg-white px-4 py-2 text-xs font-semibold tracking-wider text-black transition hover:bg-white/90 disabled:opacity-50"
            >
              <Upload className="h-3.5 w-3.5" />
              {busy ? '上传中…' : '上传视频'}
            </button>
            <span className="text-xs text-white/30">支持常见视频格式，单文件 ≤ {MAX_VIDEO_MB}MB</span>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
          {message && (
            <p className={`text-xs ${success ? 'text-emerald-400' : 'text-red-400'}`}>{message}</p>
          )}
        </div>

        <div className="space-y-3">
          {list.length === 0 ? (
            <p className="py-8 text-center text-sm text-white/25">这个阶段还没有寄语视频</p>
          ) : (
            list.map((item, i) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-xl border border-white/[0.06] bg-black/25"
              >
                <video
                  src={mediaStreamUrl(item.blobKey)}
                  className="aspect-video w-full bg-black object-contain"
                  controls
                  preload="metadata"
                />
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-white/70">
                      {i + 1}. {item.friendName || '未署名好友'}
                      {item.caption ? ` · ${item.caption}` : ''}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDelete(item.id)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/40 transition hover:border-rose-400/30 hover:text-rose-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    删除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </SpotlightCard>
    </FadeIn>
  )
}
