import { motion } from 'framer-motion'
import { useId } from 'react'

/**
 * 进度条跑步角色。
 * 后续替换：把图片放到 src/assets/ 后，在下方常量填入路径即可。
 * 例：import runnerImg from '../assets/progress_runner.png'
 *     export const PROGRESS_RUNNER_IMAGE = runnerImg
 */
export const PROGRESS_RUNNER_IMAGE: string | null = null

interface ProgressRunnerProps {
  isDragging?: boolean
  imageUrl?: string | null
}

/** 线稿风格占位剪影；有自定义素材后会自动替换 */
function RunningGirlSilhouette() {
  const uid = useId().replace(/:/g, '')
  const stroke = `url(#runner-stroke-${uid})`
  const glow = `url(#runner-glow-${uid})`

  return (
    <svg
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden
    >
      <defs>
        <linearGradient id={`runner-stroke-${uid}`} x1="6" y1="4" x2="42" y2="52">
          <stop stopColor="#ffffff" />
          <stop offset="0.5" stopColor="#f5d0fe" />
          <stop offset="1" stopColor="#d8b4fe" />
        </linearGradient>
        <radialGradient id={`runner-glow-${uid}`} cx="0" cy="0" r="1">
          <stop stopColor="#e879f9" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e879f9" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* 脚下柔光 */}
      <ellipse cx="24" cy="52" rx="10" ry="2.5" fill={glow} />

      <g
        stroke={stroke}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* 马尾 */}
        <path d="M17.5 11.5C14 13 12.5 17 13.5 22.5" />
        <path d="M16 11C13.5 9 11.5 10.5 11 13" opacity="0.75" />

        {/* 头部 */}
        <circle cx="20.5" cy="10.5" r="4.2" fill="#0a0a0a" stroke={stroke} />

        {/* 身体前倾 */}
        <path d="M22.5 14.5L27 24L25.5 36" />

        {/* 裙摆弧线（偏女生轮廓） */}
        <path d="M25.5 30C28 33 29 37 27.5 40" opacity="0.85" />

        {/* 前臂 */}
        <path d="M24 18.5L33 15.5" />
        {/* 后臂 */}
        <path d="M24 19.5L15.5 24.5" />

        {/* 前腿 */}
        <path d="M25.5 36L34.5 47" />
        {/* 后腿 */}
        <path d="M25.5 36L17 44.5" />
      </g>

      {/* 前进方向小光点 */}
      <circle cx="37" cy="28" r="1.2" fill="#faf5ff" opacity="0.65" />
      <circle cx="40.5" cy="25" r="0.8" fill="#f0abfc" opacity="0.45" />
    </svg>
  )
}

export function ProgressRunner({
  isDragging = false,
  imageUrl = PROGRESS_RUNNER_IMAGE,
}: ProgressRunnerProps) {
  const src = imageUrl ?? PROGRESS_RUNNER_IMAGE

  return (
    <motion.div
      className="pointer-events-none relative h-10 w-8 sm:h-11 sm:w-9"
      animate={
        isDragging
          ? { y: -12, scale: 1.06, rotate: 0 }
          : {
              y: [-13, -15.5, -13],
              rotate: [-1.5, 1.5, -1.5],
              scale: 1,
            }
      }
      transition={
        isDragging
          ? { duration: 0.15 }
          : {
              y: { duration: 0.48, repeat: Infinity, ease: 'easeInOut' },
              rotate: { duration: 0.48, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.2 },
            }
      }
    >
      <div
        className="absolute inset-0 rounded-full bg-fuchsia-400/10 blur-md"
        aria-hidden
      />
      {src ? (
        <img
          src={src}
          alt=""
          draggable={false}
          className="relative h-full w-full object-contain object-bottom drop-shadow-[0_2px_12px_rgba(232,121,249,0.35)]"
        />
      ) : (
        <div className="relative h-full w-full drop-shadow-[0_2px_12px_rgba(232,121,249,0.35)]">
          <RunningGirlSilhouette />
        </div>
      )}
    </motion.div>
  )
}
