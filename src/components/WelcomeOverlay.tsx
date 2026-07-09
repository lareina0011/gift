import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { APP_CONFIG } from '../constants/config'
import { BlurText, FadeIn, GradientText } from './reactbits'

interface WelcomeOverlayProps {
  open: boolean
  onClose: () => void
}

export function WelcomeOverlay({ open, onClose }: WelcomeOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#141414] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm p-1.5 text-white/30 transition hover:bg-white/5 hover:text-white/70"
            >
              <X className="h-5 w-5" />
            </button>

            <FadeIn>
              <div className="mb-4 flex items-center gap-2 text-white/50">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs tracking-[0.2em]">{APP_CONFIG.hero.label}</span>
              </div>

              <GradientText className="font-serif text-2xl font-bold">
                {APP_CONFIG.hero.title}
              </GradientText>

              <BlurText
                text="欢迎来到拾光录"
                className="mt-2 font-serif text-lg text-white/70"
                animateBy="words"
                delay={80}
              />

              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-white/45">
                {APP_CONFIG.dedication}
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-6 w-full rounded-sm bg-white py-3 text-xs font-semibold tracking-[0.15em] text-black"
              >
                开始浏览回忆
              </motion.button>
            </FadeIn>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
