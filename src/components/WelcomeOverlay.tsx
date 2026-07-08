import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { APP_CONFIG } from '../constants/config'
import { FadeIn, GradientText } from './reactbits'

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
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: 'spring', damping: 24, stiffness: 280 }}
            className="relative max-w-lg overflow-hidden rounded-3xl bg-white p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-200/40 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-rose-200/40 blur-2xl" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600"
            >
              <X className="h-5 w-5" />
            </button>

            <FadeIn>
              <div className="mb-4 flex items-center gap-2 text-violet-500">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium">毕业快乐</span>
              </div>

              <GradientText className="font-serif text-2xl font-bold">
                欢迎来到求学之路
              </GradientText>

              <p className="mt-4 whitespace-pre-line leading-relaxed text-stone-600">
                {APP_CONFIG.dedication}
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-6 w-full rounded-xl bg-gradient-to-r from-violet-500 to-rose-400 py-3 font-medium text-white shadow-lg shadow-violet-200"
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
