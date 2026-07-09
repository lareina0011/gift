import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { getStageIcon } from '../constants/icons'
import { getStageById, STAGES } from '../constants/stages'
import type { StageId } from '../types'
import { AppIcon } from './AppIcon'

interface StageTransitionProps {
  targetStage: StageId | null
  fromStage: StageId
  onComplete: () => void
}

const TRANSITION_MS = 1400

export function StageTransition({ targetStage, fromStage, onComplete }: StageTransitionProps) {
  const stage = targetStage ? getStageById(targetStage) : null
  const fromIndex = STAGES.findIndex((s) => s.id === fromStage)
  const toIndex = targetStage ? STAGES.findIndex((s) => s.id === targetStage) : -1
  const direction = toIndex >= fromIndex ? 1 : -1
  const chapterNo = toIndex >= 0 ? String(toIndex + 1).padStart(2, '0') : '01'

  const passedStages = useMemo(() => {
    if (toIndex < 0 || fromIndex < 0) return []
    const start = Math.min(fromIndex, toIndex)
    const end = Math.max(fromIndex, toIndex)
    return STAGES.slice(start, end + 1)
  }, [fromIndex, toIndex])

  useEffect(() => {
    if (!targetStage) return
    const timer = setTimeout(onComplete, TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [targetStage, onComplete])

  return (
    <AnimatePresence>
      {targetStage && stage && (
        <motion.div
          key={targetStage}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 暗场 */}
          <motion.div
            className="absolute inset-0 bg-[#050508]/88 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 时光隧道光带 */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0.5] }}
            transition={{ duration: 0.9, times: [0, 0.35, 1] }}
          >
            {[...Array(14)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 h-px origin-left"
                style={{
                  left: '50%',
                  width: '55vw',
                  background: `linear-gradient(90deg, transparent, ${stage.accent}88, transparent)`,
                  rotate: direction > 0 ? -28 + i * 4 : 28 - i * 4,
                }}
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{
                  scaleX: [0, 1.2, 0],
                  opacity: [0, 0.7, 0],
                  x: direction > 0 ? [0, 120, 280] : [0, -120, -280],
                }}
                transition={{
                  duration: 0.85,
                  delay: i * 0.03,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            ))}
          </motion.div>

          {/* 径向脉冲 */}
          <motion.div
            className="absolute left-1/2 top-1/2 h-[min(90vw,520px)] w-[min(90vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${stage.accent}22 0%, transparent 68%)`,
            }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.15, 1.4], opacity: [0, 0.85, 0] }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          />

          {/* 章节标签 */}
          <motion.div
            className="absolute top-[16%] text-center"
            initial={{ opacity: 0, y: -16, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0.38em' }}
            transition={{ delay: 0.12, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[10px] font-medium tracking-[0.38em] text-white/35">
              TIME TRAVEL
            </p>
            <p className="mt-2 font-serif text-sm text-white/55">
              第 {chapterNo} 章
            </p>
          </motion.div>

          {/* 时间轴旅程 */}
          <div className="absolute bottom-[16%] left-1/2 w-[min(400px,88vw)] -translate-x-1/2">
            <div className="relative h-px bg-white/10">
              {STAGES.map((s, i) => {
                const passed = passedStages.some((p) => p.id === s.id)
                const isTarget = s.id === targetStage
                return (
                  <motion.div
                    key={s.id}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${s.progress}%` }}
                    initial={{ scale: 0.6, opacity: 0.2 }}
                    animate={{
                      scale: passed ? (isTarget ? 1.35 : 1) : 0.75,
                      opacity: passed ? (isTarget ? 1 : 0.55) : 0.2,
                    }}
                    transition={{ delay: 0.2 + i * 0.06, duration: 0.35 }}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                        isTarget
                          ? 'border-white/70 bg-white/15 shadow-[0_0_20px_rgba(255,255,255,0.35)]'
                          : passed
                            ? 'border-white/25 bg-white/[0.06]'
                            : 'border-white/10 bg-transparent'
                      }`}
                    >
                      <AppIcon
                        config={getStageIcon(s.id)}
                        size={isTarget ? 14 : 11}
                        className={isTarget ? 'text-white' : 'text-white/40'}
                      />
                    </div>
                  </motion.div>
                )
              })}

              <motion.div
                className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-[0_0_18px_rgba(255,255,255,0.55)]"
                initial={{ left: `${STAGES[fromIndex]?.progress ?? 0}%` }}
                animate={{ left: `${stage.progress}%` }}
                transition={{ duration: 0.75, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>

            <motion.p
              className="mt-4 text-center text-[10px] tracking-[0.22em] text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {direction > 0 ? '时光向前' : '回溯往昔'}
            </motion.p>
          </div>

          {/* 章节卡片 */}
          <motion.div
            className="relative w-[min(340px,88vw)]"
            style={{ perspective: 1400 }}
            initial={{ rotateY: direction * -72, opacity: 0, scale: 0.82, y: 24 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1, y: 0 }}
            exit={{ rotateY: direction * 72, opacity: 0, scale: 0.88, y: -12 }}
            transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative overflow-hidden rounded-2xl border border-white/12 px-8 py-9 text-center shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
              style={{
                background: `linear-gradient(160deg, rgb(20 20 24 / 0.95) 0%, rgb(12 12 16 / 0.98) 55%, ${stage.accent}18 100%)`,
              }}
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${stage.accent}aa, transparent)`,
                }}
              />

              <motion.div
                initial={{ scale: 0, rotate: direction * -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.32, type: 'spring', stiffness: 280, damping: 16 }}
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05]"
                style={{ boxShadow: `0 0 32px ${stage.accent}33` }}
              >
                <AppIcon
                  config={getStageIcon(targetStage)}
                  size={34}
                  className="text-white/90"
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.42 }}
                className="mt-5 text-[11px] tracking-[0.28em] text-white/35"
              >
                进入阶段
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.48, duration: 0.45 }}
                className="mt-2 font-serif text-3xl font-bold text-white"
              >
                {stage.label}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.58 }}
                className="mt-3 text-sm italic leading-relaxed text-white/45"
              >
                {stage.quote}
              </motion.p>

              {/* 读条 */}
              <motion.div
                className="mx-auto mt-6 h-0.5 max-w-[180px] overflow-hidden rounded-full bg-white/10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: stage.accent }}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.55, duration: 0.65, ease: 'easeInOut' }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* 漂浮光点 */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${12 + i * 7}%`,
                top: `${22 + (i % 4) * 14}%`,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
                background: i % 2 === 0 ? stage.accent : 'rgba(255,255,255,0.5)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1.6, 0],
                y: direction > 0 ? [0, -40 - i * 6, -80 - i * 10] : [0, 40 + i * 6, 80 + i * 10],
                x: direction > 0 ? (i % 2 === 0 ? 12 : -12) : (i % 2 === 0 ? -12 : 12),
              }}
              transition={{ duration: 1, delay: 0.08 + i * 0.04 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
