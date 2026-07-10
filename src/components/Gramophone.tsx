import { motion } from 'framer-motion'

interface GramophoneProps {
  playing?: boolean
  progress?: number
  className?: string
}

export function Gramophone({ playing = false, progress = 0, className = '' }: GramophoneProps) {
  return (
    <div className={`gramophone pointer-events-none select-none ${className}`} aria-hidden>
      <svg
        viewBox="0 0 320 200"
        className="h-auto w-full max-w-[min(320px,72vw)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="horn-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c4a574" />
            <stop offset="45%" stopColor="#8b6914" />
            <stop offset="100%" stopColor="#5c3d0a" />
          </linearGradient>
          <linearGradient id="horn-inner" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2a1810" />
            <stop offset="100%" stopColor="#1a0f08" />
          </linearGradient>
          <radialGradient id="vinyl-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1a1a1e" />
            <stop offset="55%" stopColor="#0d0d10" />
            <stop offset="100%" stopColor="#050508" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 底座 */}
        <ellipse cx="160" cy="178" rx="72" ry="10" fill="rgba(0,0,0,0.35)" />
        <path
          d="M108 168 Q160 182 212 168 L208 158 Q160 172 112 158 Z"
          fill="url(#horn-grad)"
          opacity="0.9"
        />
        <rect x="118" y="148" width="84" height="14" rx="3" fill="#3d2817" />
        <rect x="124" y="152" width="72" height="6" rx="1" fill="#5c3d0a" opacity="0.6" />

        {/* 转盘 */}
        <g transform="translate(160, 118)">
          <circle cx="0" cy="0" r="52" fill="#1a1510" opacity="0.5" />
          <motion.g
            animate={{ rotate: playing ? 360 : 0 }}
            transition={
              playing
                ? { duration: 3.2, repeat: Infinity, ease: 'linear' }
                : { duration: 0.6, ease: 'easeOut' }
            }
            style={{ transformOrigin: '0px 0px' }}
          >
            <circle cx="0" cy="0" r="46" fill="url(#vinyl-grad)" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {/* 纹路 */}
            {[38, 32, 26, 20, 14].map((r) => (
              <circle
                key={r}
                cx="0"
                cy="0"
                r={r}
                stroke="rgba(255,255,255,0.04)"
                strokeWidth="0.5"
                fill="none"
              />
            ))}
            <circle cx="0" cy="0" r="6" fill="#2a1810" stroke="#c4a574" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="2" fill="#8b6914" />
            {/* 光泽 */}
            <ellipse cx="-8" cy="-10" rx="14" ry="6" fill="rgba(255,255,255,0.04)" transform="rotate(-25)" />
          </motion.g>
        </g>

        {/* 唱臂 */}
        <motion.g
          animate={{ rotate: playing ? -8 : -32 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: '228px 92px' }}
        >
          <line x1="228" y1="92" x2="198" y2="108" stroke="#8b7355" strokeWidth="3" strokeLinecap="round" />
          <line x1="198" y1="108" x2="178" y2="112" stroke="#6b5344" strokeWidth="2" strokeLinecap="round" />
          <circle cx="228" cy="92" r="5" fill="#5c3d0a" stroke="#c4a574" strokeWidth="1" />
          <ellipse cx="176" cy="113" rx="4" ry="2" fill="#2a1810" transform="rotate(-20 176 113)" />
        </motion.g>

        {/* 喇叭 */}
        <path
          d="M248 48 Q290 20 310 8 L308 28 Q285 42 252 62 Z"
          fill="url(#horn-grad)"
          stroke="rgba(196,165,116,0.4)"
          strokeWidth="0.5"
        />
        <path
          d="M252 54 Q278 38 298 26 L296 34 Q276 46 254 58 Z"
          fill="url(#horn-inner)"
        />
        <ellipse cx="248" cy="56" rx="8" ry="10" fill="#3d2817" />
        <path
          d="M228 62 L248 54"
          stroke="#6b5344"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 音符（播放时） */}
        {playing && (
          <>
            <motion.g
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.7, 0], y: -28, x: 8 }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0 }}
            >
              <text x="268" y="32" fill="rgba(244,114,182,0.6)" fontSize="14">
                ♪
              </text>
            </motion.g>
            <motion.g
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.5, 0], y: -22, x: -6 }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.8 }}
            >
              <text x="278" y="40" fill="rgba(167,139,250,0.5)" fontSize="11">
                ♫
              </text>
            </motion.g>
          </>
        )}
      </svg>

      {/* 进度光晕 */}
      {playing && (
        <motion.div
          className="absolute bottom-2 left-1/2 h-1 w-24 -translate-x-1/2 overflow-hidden rounded-full bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-600/60 to-fuchsia-400/60"
            style={{ width: `${progress * 100}%` }}
          />
        </motion.div>
      )}
    </div>
  )
}
