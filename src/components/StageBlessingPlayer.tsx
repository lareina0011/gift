import { AnimatePresence, motion } from 'framer-motion'
import { SkipForward, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { mediaStreamUrl } from '../api/client'
import { getStageById } from '../constants/stages'
import type { StageBlessing, StageId } from '../types'

interface StageBlessingPlayerProps {
  stageId: StageId | null
  blessings: StageBlessing[]
  onComplete: () => void
}

export function StageBlessingPlayer({
  stageId,
  blessings,
  onComplete,
}: StageBlessingPlayerProps) {
  const stage = stageId ? getStageById(stageId) : null
  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const list = useMemo(
    () => [...blessings].sort((a, b) => a.sortOrder - b.sortOrder),
    [blessings],
  )
  const current = list[index] ?? null

  useEffect(() => {
    setIndex(0)
  }, [stageId])

  useEffect(() => {
    const el = videoRef.current
    if (!el || !current) return
    el.load()
    const play = el.play()
    if (play) play.catch(() => undefined)
  }, [current?.id])

  const finish = () => onComplete()

  const goNext = () => {
    if (index >= list.length - 1) {
      finish()
      return
    }
    setIndex((i) => i + 1)
  }

  if (!stageId || !stage || list.length === 0) return null

  return (
    <AnimatePresence>
      <motion.div
        key={`${stageId}-${current?.id ?? 'empty'}`}
        className="fixed inset-0 z-[110] flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="absolute inset-0 bg-[#050508]/92 backdrop-blur-md" />

        <div className="relative z-10 flex w-full max-w-3xl flex-col px-4">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[10px] tracking-[0.32em] text-white/35">好友寄语</p>
              <h2 className="mt-1 font-serif text-xl text-white sm:text-2xl">
                {stage.label}
                <span className="ml-2 text-sm font-sans font-normal text-white/40">
                  {index + 1} / {list.length}
                </span>
              </h2>
              {(current?.friendName || current?.caption) && (
                <p className="mt-1 text-sm text-white/55">
                  {current.friendName
                    ? `${current.friendName}${current.caption ? ` · ${current.caption}` : ''}`
                    : current.caption}
                </p>
              )}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setMuted((v) => !v)}
                className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/50 transition hover:text-white"
                aria-label={muted ? '取消静音' : '静音'}
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs tracking-wider text-white/55 transition hover:border-white/25 hover:text-white"
              >
                <SkipForward className="h-3.5 w-3.5" />
                {index >= list.length - 1 ? '进入阶段' : '下一段'}
              </button>
              <button
                type="button"
                onClick={finish}
                className="rounded-lg px-3 py-2 text-xs tracking-wider text-white/35 transition hover:text-white/70"
              >
                全部跳过
              </button>
            </div>
          </div>

          <div
            className="overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            style={{ boxShadow: `0 0 0 1px ${stage.accent}22, 0 24px 80px rgba(0,0,0,0.55)` }}
          >
            {current && (
              <video
                ref={videoRef}
                key={current.id}
                src={mediaStreamUrl(current.blobKey)}
                className="aspect-video w-full bg-black object-contain"
                controls
                playsInline
                autoPlay
                muted={muted}
                onEnded={goNext}
              />
            )}
          </div>

          <p className="mt-4 text-center text-[11px] tracking-[0.2em] text-white/25">
            播放结束后将进入本阶段回忆
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
