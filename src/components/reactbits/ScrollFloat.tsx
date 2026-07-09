import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useMemo, useRef, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

interface ScrollFloatProps {
  children: string
  className?: string
  containerClassName?: string
  scrollContainerRef?: RefObject<HTMLElement | null>
  /** 不传则使用文字自身作为触发区域 */
  triggerRef?: RefObject<HTMLElement | null>
  scrollStart?: string
  scrollEnd?: string
  stagger?: number
}

/**
 * React Bits ScrollFloat — 文字随滚动从卷轴中浮出
 * @see https://reactbits.dev/text-animations/scroll-float
 */
export function ScrollFloat({
  children,
  className = '',
  containerClassName = '',
  scrollContainerRef,
  triggerRef,
  scrollStart = 'top 92%',
  scrollEnd = 'top 55%',
  stagger = 0.018,
}: ScrollFloatProps) {
  const containerRef = useRef<HTMLSpanElement>(null)

  const splitText = useMemo(
    () =>
      children.split('').map((char, index) => (
        <span
          key={`${char}-${index}`}
          className="scroll-float-char inline-block overflow-hidden align-bottom leading-none"
          aria-hidden={char === ' '}
        >
          <span className="scroll-float-inner inline-block will-change-transform">
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      )),
    [children],
  )

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const trigger = triggerRef?.current ?? el
    const charInners = el.querySelectorAll('.scroll-float-inner')

    const tween = gsap.fromTo(
      charInners,
      {
        opacity: 0,
        yPercent: 85,
        scaleY: 1.45,
        scaleX: 0.88,
        transformOrigin: '50% 100%',
      },
      {
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger,
        ease: 'none',
        scrollTrigger: {
          trigger,
          scroller: scrollContainerRef?.current ?? undefined,
          start: scrollStart,
          end: scrollEnd,
          scrub: 0.45,
        },
      },
    )

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [children, scrollContainerRef, triggerRef, scrollStart, scrollEnd, stagger])

  return (
    <span ref={containerRef} className={`scroll-float block ${containerClassName}`}>
      <span className={className}>{splitText}</span>
    </span>
  )
}
