import { AnimatePresence, motion } from 'framer-motion'
import { Mail, X } from 'lucide-react'
import { mediaStreamUrl } from '../api/client'
import type { SiteLetter } from '../types'

interface LetterPanelProps {
  open: boolean
  letter: SiteLetter | null
  onClose: () => void
}

export function LetterPanel({ open, letter, onClose }: LetterPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-h-[92vh] w-full max-w-2xl overflow-hidden rounded-t-2xl border border-white/10 bg-[#1a1620] sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/8 px-5 py-4 sm:px-7">
              <div className="flex items-center gap-2 text-white/70">
                <Mail className="h-4 w-4" />
                <span className="text-sm tracking-wider">一封给你的信</span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-white/35 transition hover:bg-white/5 hover:text-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-64px)] overflow-y-auto px-5 py-6 sm:px-8 sm:py-8">
              <div className="rounded-xl border border-amber-100/10 bg-gradient-to-b from-[#f5efe3]/95 to-[#ebe2d0]/92 px-6 py-8 text-[#2c2416] shadow-inner sm:px-10 sm:py-10">
                <h2 className="font-serif text-2xl font-bold tracking-wide sm:text-3xl">
                  {letter?.title || '写给你的一封信'}
                </h2>
                <p className="mt-6 whitespace-pre-wrap font-serif text-base leading-[1.9] sm:text-lg">
                  {letter?.body?.trim()
                    ? letter.body
                    : '这封信还在书写中，稍后再来开启。'}
                </p>
              </div>

              {letter && letter.voices.length > 0 && (
                <div className="mt-6 space-y-3">
                  <p className="text-xs tracking-[0.2em] text-white/35">语音留言</p>
                  {letter.voices.map((voice) => (
                    <div
                      key={voice.id}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                    >
                      {voice.label && (
                        <p className="mb-2 text-sm text-white/55">{voice.label}</p>
                      )}
                      <audio controls src={mediaStreamUrl(voice.blobKey)} className="w-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
