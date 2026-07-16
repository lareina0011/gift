import { motion } from 'framer-motion'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getStageIcon } from '../constants/icons'
import { AppIcon } from './AppIcon'
import { STAGES } from '../constants/stages'
import { APP_CONFIG } from '../constants/config'
import { CountUp } from './reactbits'
import { ProgressRunner } from './ProgressRunner'
import type { StageId } from '../types'

interface ProgressBarProps {
  activeStage: StageId | null
  onStageChange: (id: StageId) => void
}

function snapToStage(progress: number): StageId {
  let nearest = STAGES[0]
  let minDiff = Infinity
  for (const stage of STAGES) {
    const diff = Math.abs(stage.progress - progress)
    if (diff < minDiff) {
      minDiff = diff
      nearest = stage
    }
  }
  return nearest.id
}

function clampProgress(value: number) {
  return Math.max(0, Math.min(100, value))
}

/** 将阶段进度映射为同一横坐标，并在 0%/100% 贴边避免出界 */
function getProgressAnchorStyle(progress: number) {
  if (progress <= 0) {
    return { left: '0%', transform: 'translateX(0)' }
  }
  if (progress >= 100) {
    return { left: '100%', transform: 'translateX(-100%)' }
  }
  return { left: `${progress}%`, transform: 'translateX(-50%)' }
}

export function ProgressBar({ activeStage, onStageChange }: ProgressBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState<number | null>(null)

  const activeIndex = activeStage ? STAGES.findIndex((s) => s.id === activeStage) : -1
  const stageProgress = activeIndex >= 0 ? (STAGES[activeIndex]?.progress ?? 0) : 0
  const displayProgress = dragProgress ?? stageProgress

  const progressFromClientX = useCallback((clientX: number) => {
    const track = trackRef.current
    if (!track) return 0
    const rect = track.getBoundingClientRect()
    return clampProgress(((clientX - rect.left) / rect.width) * 100)
  }, [])

  const startDrag = useCallback(
    (clientX: number) => {
      setIsDragging(true)
      setDragProgress(progressFromClientX(clientX))
    },
    [progressFromClientX],
  )

  const finishDrag = useCallback(
    (clientX: number) => {
      onStageChange(snapToStage(progressFromClientX(clientX)))
      setIsDragging(false)
      setDragProgress(null)
    },
    [onStageChange, progressFromClientX],
  )

  useEffect(() => {
    if (!isDragging) return

    const onMove = (e: PointerEvent) => setDragProgress(progressFromClientX(e.clientX))
    const onUp = (e: PointerEvent) => finishDrag(e.clientX)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [isDragging, finishDrag, progressFromClientX])

  const dragStageId = dragProgress !== null ? snapToStage(dragProgress) : activeStage
  const dragIndex = dragStageId ? STAGES.findIndex((s) => s.id === dragStageId) : -1
  const highlightIndex = isDragging ? dragIndex : activeIndex

  return (
    <div className="border-t glass-chrome">
      <div className="page-shell py-4">
        <div className="mb-3 flex items-center justify-between text-xs text-white/35">
          <span className="tracking-wider">{APP_CONFIG.progressLabel}</span>
          <span className="font-semibold text-white/70">
            {isDragging ? (
              <>{Math.round(displayProgress)}%</>
            ) : (
              <CountUp key={activeStage ?? 'none'} to={stageProgress} suffix="%" duration={0.6} />
            )}
            {isDragging && (
              <span className="ml-1.5 text-white/50">
                · {STAGES[dragIndex]?.shortLabel}
              </span>
            )}
          </span>
        </div>

        <div
          ref={trackRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(displayProgress)}
          aria-label="人生求学进度"
          className={`relative h-12 touch-none select-none sm:h-14 ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onPointerDown={(e) => {
            e.preventDefault()
            startDrag(e.clientX)
          }}
        >
          <div className="absolute top-1/2 h-px w-full -translate-y-1/2 overflow-hidden bg-white/10">
            <div
              className="absolute inset-y-0 left-0 bg-white/50"
              style={{
                width: `${displayProgress}%`,
                transition: isDragging ? 'none' : 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          </div>

          {STAGES.map((stage) => {
            const anchor = getProgressAnchorStyle(stage.progress)
            return (
              <div
                key={stage.id}
                className="pointer-events-none absolute top-1/2 z-10"
                style={{
                  left: anchor.left,
                  transform: `${anchor.transform} translateY(-50%)`,
                }}
              >
                <div className="rounded-full bg-[#0a0a0a] p-0.5 ring-1 ring-white/20">
                  <AppIcon config={getStageIcon(stage.id)} size={12} className="text-white/60" />
                </div>
              </div>
            )
          })}

          {(() => {
            const anchor = getProgressAnchorStyle(displayProgress)
            return (
              <div
                className="pointer-events-none absolute top-1/2 z-20"
                style={{
                  left: anchor.left,
                  transform: `${anchor.transform} translateY(-50%)`,
                  transition: isDragging
                    ? 'none'
                    : 'left 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                <ProgressRunner isDragging={isDragging} />
              </div>
            )
          })()}
        </div>

        <div className="pointer-events-none relative mt-2 h-11 w-full">
          {STAGES.map((stage, i) => {
            const reached = highlightIndex >= 0 && i <= highlightIndex
            const active = (isDragging ? dragStageId : activeStage) === stage.id
            const anchor = getProgressAnchorStyle(stage.progress)
            return (
              <div
                key={stage.id}
                className="absolute top-0 flex max-w-[4.5rem] flex-col items-center gap-1"
                style={{
                  left: anchor.left,
                  transform: anchor.transform,
                }}
              >
                <motion.div
                  animate={{
                    scale: active ? 1.15 : 1,
                    opacity: reached ? 1 : 0.35,
                  }}
                  transition={{ duration: isDragging ? 0.1 : 0.3 }}
                >
                  <AppIcon
                    config={getStageIcon(stage.id)}
                    size={active ? 20 : 16}
                    className={active ? 'text-white' : 'text-white/30'}
                  />
                </motion.div>
                <span
                  className={`truncate text-[10px] ${
                    active
                      ? 'font-semibold text-white/80'
                      : reached
                        ? 'text-white/40'
                        : 'text-white/15'
                  }`}
                >
                  {stage.shortLabel}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
