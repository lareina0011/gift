import { Music2, Pause, Volume2 } from 'lucide-react'
import type { RefObject } from 'react'

interface BgmControlProps {
  hasBgm: boolean
  enabled: boolean
  playing: boolean
  volume: number
  onToggle: () => void
  onVolume: (v: number) => void
  audioRef: RefObject<HTMLAudioElement | null>
}

export function BgmControl({
  hasBgm,
  enabled,
  playing,
  volume,
  onToggle,
  onVolume,
  audioRef,
}: BgmControlProps) {
  if (!hasBgm) return null

  return (
    <div className="fixed bottom-20 right-4 z-[60] flex items-center gap-2 rounded-full border border-white/10 bg-[#0c0a12]/85 px-3 py-2 shadow-lg backdrop-blur-md sm:bottom-24 sm:right-6">
      <audio ref={audioRef} preload="auto" />
      <button
        type="button"
        onClick={onToggle}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/15"
        aria-label={enabled ? '关闭背景音乐' : '打开背景音乐'}
        title={enabled ? '关闭背景音乐' : '打开背景音乐'}
      >
        {playing ? <Pause className="h-3.5 w-3.5" /> : <Music2 className="h-3.5 w-3.5" />}
      </button>
      <Volume2 className="hidden h-3.5 w-3.5 text-white/35 sm:block" />
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={volume}
        onChange={(e) => onVolume(Number(e.target.value))}
        className="hidden w-20 accent-fuchsia-400 sm:block"
        aria-label="背景音乐音量"
      />
    </div>
  )
}
