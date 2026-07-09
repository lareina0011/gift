import { AnimatePresence, motion } from 'framer-motion'
import { ImageIcon, Music } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { APP_CONFIG } from '../constants/config'
import { markIntroPlayedThisSession } from '../utils/introMedia'

interface LoginIntroOverlayProps {
  open: boolean
  imageUrl: string | null
  audioUrl: string | null
  onComplete: () => void
}

const IMAGE_ONLY_MS = 5000

export function LoginIntroOverlay({
  open,
  imageUrl,
  audioUrl,
  onComplete,
}: LoginIntroOverlayProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  const [playing, setPlaying] = useState(false)
  const completedRef = useRef(false)

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    audioRef.current?.pause()
    markIntroPlayedThisSession()
    onComplete()
  }, [onComplete])

  useEffect(() => {
    if (!open) {
      completedRef.current = false
      setProgress(0)
      setPlaying(false)
      return
    }

    const audio = audioRef.current
    if (audioUrl && audio) {
      audio.currentTime = 0
      const playPromise = audio.play()
      if (playPromise) {
        playPromise
          .then(() => setPlaying(true))
          .catch(() => {
            setTimeout(finish, IMAGE_ONLY_MS)
          })
      }
      return
    }

    if (imageUrl && !audioUrl) {
      const timer = setTimeout(finish, IMAGE_ONLY_MS)
      return () => clearTimeout(timer)
    }

    finish()
  }, [open, audioUrl, imageUrl, finish])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !open) return

    const onTimeUpdate = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return
      setProgress(audio.currentTime / audio.duration)
    }

    const onEnded = () => finish()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
    }
  }, [audioUrl, open, finish])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-center overflow-hidden bg-[#050508]/95 p-4 backdrop-blur-xl"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(168,85,247,0.12),transparent_65%)]"
            aria-hidden
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full max-w-3xl flex-col items-center"
          >
            <p className="mb-5 text-[11px] tracking-[0.32em] text-white/35">
              {APP_CONFIG.siteTitle}
            </p>

            {/* 图片位 */}
            <div className="intro-media-frame relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="开场画面"
                  className="aspect-[16/10] w-full object-cover sm:aspect-[16/9]"
                />
              ) : (
                <div className="flex aspect-[16/10] w-full flex-col items-center justify-center gap-3 text-white/25 sm:aspect-[16/9]">
                  <ImageIcon className="h-12 w-12" />
                  <p className="text-sm tracking-wider">图片位 · 待上传</p>
                </div>
              )}
            </div>

            {/* 音频位（隐藏播放器 + 状态） */}
            <div className="mt-6 flex w-full max-w-md flex-col items-center gap-3">
              {audioUrl ? (
                <>
                  <audio ref={audioRef} src={audioUrl} preload="auto" className="hidden" />
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Music className={`h-3.5 w-3.5 ${playing ? 'text-fuchsia-300/80' : ''}`} />
                    <span>{playing ? '正在播放开场音频…' : '准备播放…'}</span>
                  </div>
                  <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-400"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 rounded-full border border-dashed border-white/10 px-4 py-2 text-xs text-white/25">
                  <Music className="h-3.5 w-3.5" />
                  音频位 · 待上传
                </div>
              )}
            </div>

            <p className="mt-8 text-center text-xs text-white/25">
              {audioUrl ? '音频结束后将自动进入' : '稍后将自动进入'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
