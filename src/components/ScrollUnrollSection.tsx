import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef, type ReactNode, type RefObject } from 'react'

gsap.registerPlugin(ScrollTrigger)

interface ScrollUnrollSectionProps {
  children: ReactNode
  triggerRef: RefObject<HTMLElement | null>
  className?: string
}

/** 卷轴式展开 — 下方内容随滚动缓缓拉出（不含 ScrollFloat 文字） */
export function ScrollUnrollSection({
  children,
  triggerRef,
  className = '',
}: ScrollUnrollSectionProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const trigger = triggerRef.current
    const panel = panelRef.current
    const paper = paperRef.current
    if (!trigger || !panel || !paper) return

    const items = paper.querySelectorAll('[data-scroll-unroll]')

    const ctx = gsap.context(() => {
      gsap.set(panel, { pointerEvents: 'none' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: 'bottom bottom',
          end: 'bottom 25%',
          scrub: 0.5,
          onUpdate: (self) => {
            panel.style.pointerEvents = self.progress > 0.7 ? 'auto' : 'none'
          },
        },
      })

      tl.fromTo(
        paper,
        {
          clipPath: 'inset(0 0 100% 0)',
          opacity: 0.5,
        },
        {
          clipPath: 'inset(0 0 0% 0)',
          opacity: 1,
          duration: 0.6,
          ease: 'none',
        },
        0,
      ).fromTo(
        items,
        {
          opacity: 0,
          y: 36,
          scaleY: 1.12,
          scaleX: 0.96,
          transformOrigin: '50% 0%',
        },
        {
          opacity: 1,
          y: 0,
          scaleY: 1,
          scaleX: 1,
          stagger: 0.05,
          duration: 0.5,
          ease: 'none',
        },
        0.1,
      )
    }, panel)

    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh)
    refresh()

    return () => {
      window.removeEventListener('load', refresh)
      ctx.revert()
    }
  }, [triggerRef])

  return (
    <div ref={panelRef} className={`relative ${className}`}>
      <div ref={paperRef} className="scroll-paper relative">
        {children}
      </div>
    </div>
  )
}
