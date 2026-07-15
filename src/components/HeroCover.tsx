import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { forwardRef, useEffect, useState } from 'react'
import { APP_CONFIG } from '../constants/config'
import { BlurText } from './reactbits'

interface HeroCoverProps {
  onExplore: () => void
  onFuture: () => void
  onOpenLetter: () => void
  onShareCard: () => void
}

export const HeroCover = forwardRef<HTMLElement, HeroCoverProps>(function HeroCover(
  { onExplore, onFuture, onOpenLetter, onShareCard },
  ref,
) {
  const { hero } = APP_CONFIG
  const [expanded, setExpanded] = useState(false)
  const [showScrollHint, setShowScrollHint] = useState(true)

  useEffect(() => {
    const onScroll = () => {
      setShowScrollHint(window.scrollY < 32)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={ref}
      className="relative flex h-[100dvh] min-h-screen w-full flex-col justify-center overflow-hidden"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#0a0a0a]/80"
      />

      <div className="relative z-10 page-shell w-full pb-24 pt-24 sm:pb-28 sm:pt-28">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-4 text-xs font-medium tracking-[0.35em] text-white/45 sm:text-sm"
        >
          {hero.label}
        </motion.p>

        <BlurText
          text={hero.title}
          className="font-serif text-4xl font-bold leading-tight text-white sm:text-6xl md:text-7xl"
          animateBy="words"
          delay={100}
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:max-w-3xl sm:text-lg"
        >
          {hero.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onExplore}
            className="rounded-sm bg-white px-7 py-3.5 text-sm font-semibold tracking-[0.12em] text-black transition hover:bg-white/90"
          >
            {hero.exploreText.toUpperCase()}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onFuture}
            className="rounded-sm border border-white/30 px-7 py-3.5 text-sm font-semibold tracking-[0.12em] text-white transition hover:border-white/60 hover:bg-white/5"
          >
            {hero.futureText.toUpperCase()}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenLetter}
            className="rounded-sm border border-white/20 px-7 py-3.5 text-sm font-semibold tracking-[0.12em] text-white/85 transition hover:border-white/50 hover:bg-white/5"
          >
            一封信
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={onShareCard}
            className="rounded-sm border border-white/20 px-7 py-3.5 text-sm font-semibold tracking-[0.12em] text-white/85 transition hover:border-white/50 hover:bg-white/5"
          >
            纪念卡
          </motion.button>
        </motion.div>

        {/* 可折叠寄语 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-14"
        >
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="group flex w-full items-center gap-2 text-left"
            aria-expanded={expanded}
          >
            <span className="font-serif text-base font-medium tracking-wide text-white/70 transition group-hover:text-white sm:text-lg">
              {APP_CONFIG.siteTitle}
            </span>
            <motion.span
              animate={{ rotate: expanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-white/50 group-hover:text-white/80"
            >
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="dedication"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <p className="mt-4 max-w-xl whitespace-pre-line border-l-2 border-white/15 pl-5 text-sm leading-relaxed text-white/50 sm:text-base">
                  {APP_CONFIG.dedication}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            key="scroll-hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="flex flex-col items-center gap-2 text-white/35"
            >
              <span className="text-[10px] tracking-[0.25em]">向下滚动</span>
              <ChevronDown className="h-5 w-5" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
})
