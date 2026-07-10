import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { APP_CONFIG } from '../constants/config'
import { BlurText } from './reactbits'

interface WelcomeUserOverlayProps {
  open: boolean
  username: string
  onComplete: () => void
  autoDismissMs?: number
}

export function WelcomeUserOverlay({
  open,
  username,
  onComplete,
  autoDismissMs = 3800,
}: WelcomeUserOverlayProps) {
  useEffect(() => {
    if (!open) return
    const timer = setTimeout(onComplete, autoDismissMs)
    return () => clearTimeout(timer)
  }, [open, onComplete, autoDismissMs])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="welcome-user"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="welcome-user-overlay fixed inset-0 z-[65] flex items-center justify-center overflow-hidden"
          onClick={onComplete}
        >
          <div className="pointer-events-none absolute inset-0 bg-[#030305]/92 backdrop-blur-2xl" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 45%, rgba(168,85,247,0.22) 0%, rgba(88,28,135,0.08) 40%, transparent 70%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.55)',
            }}
          />

          <motion.div
            className="absolute left-1/2 top-1/2 h-[min(140vw,720px)] w-[min(140vw,720px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(217,70,239,0.2) 0%, rgba(139,92,246,0.08) 40%, transparent 65%)',
            }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: [0.2, 1.3, 1.6], opacity: [0, 1, 0] }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
          />

          <motion.div
            className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-transparent via-white/10 to-transparent"
            initial={{ x: '-130%', opacity: 0 }}
            animate={{ x: '350%', opacity: [0, 1, 0] }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 48, filter: 'blur(16px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.06, y: -28, filter: 'blur(10px)' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-5xl px-6 text-center sm:px-10"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-5 py-2 text-xs tracking-[0.35em] text-white/45 sm:text-sm"
            >
              <Sparkles className="h-4 w-4 text-fuchsia-300/80" />
              WELCOME BACK
            </motion.div>

            <BlurText
              text="欢迎你"
              className="font-serif text-5xl font-medium leading-none text-white/85 sm:text-6xl md:text-7xl lg:text-8xl"
              animateBy="letters"
              delay={70}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="welcome-username mt-6 sm:mt-8"
            >
              <span className="text-6xl leading-none sm:text-7xl md:text-8xl lg:text-[7rem]">
                {username}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.55 }}
              className="mx-auto mt-10 max-w-lg text-base leading-relaxed text-white/45 sm:text-lg md:text-xl"
            >
              {APP_CONFIG.loginSubtitle}
            </motion.p>

            <motion.div
              className="mx-auto mt-10 h-px w-32 bg-gradient-to-r from-transparent via-fuchsia-400/60 to-transparent sm:w-48"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 1.05, duration: 0.7 }}
            />

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-8 text-xs tracking-[0.28em] text-white/25 sm:text-sm"
            >
              点击进入
            </motion.p>
          </motion.div>

          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-fuchsia-300/40"
              style={{
                left: `${10 + i * 8}%`,
                top: `${20 + (i % 4) * 16}%`,
                width: 2 + (i % 3),
                height: 2 + (i % 3),
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                scale: [0, 1.8, 0],
                y: [0, -32 - i * 8],
              }}
              transition={{ duration: 2, delay: 0.25 + i * 0.08 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
