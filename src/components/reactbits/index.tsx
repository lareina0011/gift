import { motion, useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

interface BlurTextProps {
  text: string
  delay?: number
  className?: string
  animateBy?: 'words' | 'letters'
  direction?: 'top' | 'bottom'
}

export function BlurText({
  text,
  delay = 120,
  className = '',
  animateBy = 'words',
  direction = 'top',
}: BlurTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const elements = animateBy === 'words' ? text.split(' ') : text.split('')

  const from = direction === 'top'
    ? { filter: 'blur(10px)', opacity: 0, y: -24 }
    : { filter: 'blur(10px)', opacity: 0, y: 24 }

  return (
    <p ref={ref} className={className}>
      {elements.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          initial={from}
          animate={inView ? { filter: 'blur(0px)', opacity: 1, y: 0 } : from}
          transition={{
            duration: 0.5,
            delay: (index * delay) / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{ display: 'inline-block' }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </p>
  )
}

interface ShinyTextProps {
  text: string
  className?: string
  color?: string
  shineColor?: string
}

export function ShinyText({
  text,
  className = '',
  color = '#78716c',
  shineColor = '#c084fc',
}: ShinyTextProps) {
  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 40%, ${shineColor} 50%, ${color} 60%, ${color} 100%)`,
        backgroundSize: '200% auto',
      }}
      animate={{ backgroundPosition: ['200% center', '-200% center'] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
    >
      {text}
    </motion.span>
  )
}

interface GradientTextProps {
  children: ReactNode
  className?: string
  colors?: string[]
}

export function GradientText({
  children,
  className = '',
  colors = ['#a855f7', '#ec4899', '#f472b6', '#a855f7'],
}: GradientTextProps) {
  const gradient = useMemo(() => colors.join(', '), [colors])

  return (
    <motion.span
      className={`inline-block bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage: `linear-gradient(90deg, ${gradient})`,
        backgroundSize: '300% 100%',
      }}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  )
}

interface CountUpProps {
  to: number
  className?: string
  duration?: number
  suffix?: string
}

export function CountUp({ to, className = '', duration = 0.8, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView || !ref.current) return
    const start = performance.now()
    const from = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / (duration * 1000), 1)
      const eased = 1 - (1 - progress) ** 3
      const value = Math.round(from + (to - from) * eased)
      if (ref.current) ref.current.textContent = `${value}${suffix}`
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [inView, to, duration, suffix])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}

interface FadeInProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
}

export function FadeIn({ children, className = '', delay = 0, y = 24 }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y, filter: 'blur(6px)' }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(196, 132, 252, 0.18)',
}: SpotlightCardProps) {
  const divRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  return (
    <div
      ref={divRef}
      onMouseMove={(e) => {
        if (!divRef.current) return
        const rect = divRef.current.getBoundingClientRect()
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(480px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 45%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}
