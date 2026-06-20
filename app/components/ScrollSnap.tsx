'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface ScrollSnapProps {
  targets: string[]
  noSnapZone?: string
  enabled?: boolean
  /** Called before navigating. Return 'block' to prevent scroll (e.g., for boot sequence) */
  onNavigate?: (fromId: string, toId: string) => 'block' | void
}

export default function ScrollSnap({
  targets,
  noSnapZone,
  enabled = true,
  onNavigate,
}: ScrollSnapProps) {
  const isAnimatingRef = useRef(false)
  const cooldownRef = useRef(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [pressed, setPressed] = useState<'up' | 'down' | null>(null)

  const getSnapPoints = useCallback((): { pos: number; id: string }[] => {
    const points: { pos: number; id: string }[] = [{ pos: 0, id: 'hero' }]

    if (noSnapZone) {
      const zone = document.querySelector(noSnapZone) as HTMLElement
      if (zone) {
        const zoneTop = zone.offsetTop
        const zoneScrollable = zone.offsetHeight - window.innerHeight
        points.push({ pos: zoneTop + zoneScrollable * 0.65, id: 'baker' })
      }
    }

    const mobile = window.innerWidth < 768
    targets.forEach(selector => {
      const el = document.querySelector(selector) as HTMLElement
      if (el) {
        const pos = mobile ? el.offsetTop : el.offsetTop - (window.innerHeight - el.offsetHeight) / 2
        points.push({ pos, id: el.id || selector })
      }
    })

    return points.sort((a, b) => a.pos - b.pos)
  }, [targets, noSnapZone])

  const findCurrentIndex = useCallback((points: { pos: number; id: string }[]): number => {
    const scrollY = window.scrollY
    let bestIdx = 0
    let bestDist = Infinity
    for (let i = 0; i < points.length; i++) {
      const dist = Math.abs(scrollY - points[i].pos)
      if (dist < bestDist) {
        bestDist = dist
        bestIdx = i
      }
    }
    return bestIdx
  }, [])

  const animateTo = useCallback((target: number, duration: number) => {
    const start = window.scrollY
    const dist = target - start
    if (Math.abs(dist) < 5) return

    isAnimatingRef.current = true
    setIsAnimating(true) // visual: grey out buttons during the scroll

    const startTime = performance.now()
    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)
      const eased = t
      window.scrollTo(0, start + dist * eased)
      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        cooldownRef.current = true
        setTimeout(() => {
          isAnimatingRef.current = false
          cooldownRef.current = false
          setIsAnimating(false) // scroll stopped: restore buttons
        }, 200)
      }
    }
    requestAnimationFrame(animate)
  }, [])

  const navigate = useCallback((direction: 1 | -1) => {
    if (isAnimatingRef.current || cooldownRef.current) return

    const points = getSnapPoints()
    const idx = findCurrentIndex(points)
    const nextIdx = Math.max(0, Math.min(points.length - 1, idx + direction))

    if (nextIdx === idx) return

    const fromId = points[idx].id
    const toId = points[nextIdx].id

    // Check if navigation should be blocked (e.g., boot sequence)
    if (onNavigate) {
      const result = onNavigate(fromId, toId)
      if (result === 'block') return
    }

    const target = points[nextIdx].pos
    const dist = Math.abs(target - window.scrollY)

    const inZone = noSnapZone && (() => {
      const zone = document.querySelector(noSnapZone) as HTMLElement
      if (!zone) return false
      const zoneTop = zone.offsetTop
      const zoneEnd = zoneTop + zone.offsetHeight
      return window.scrollY >= zoneTop - window.innerHeight && target <= zoneEnd
    })()

    const duration = inZone
      ? Math.min(6000, Math.max(3000, dist * 1.5))
      : Math.min(800, Math.max(300, dist * 0.5))

    setCurrentIdx(nextIdx)
    animateTo(target, duration)
  }, [getSnapPoints, findCurrentIndex, animateTo, noSnapZone, onNavigate])

  useEffect(() => {
    if (!enabled) return

    // Block native scrolling entirely — navigation happens only via the on-screen buttons.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
    }

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current || cooldownRef.current) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== ' ' && e.key !== 'PageDown' && e.key !== 'PageUp') return
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      e.preventDefault()
      const direction = (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') ? 1 : -1
      // Visually press the matching on-screen key
      setPressed(direction === 1 ? 'down' : 'up')
      window.setTimeout(() => setPressed(null), 150)
      navigate(direction as 1 | -1)
    }

    // Mobile: block scroll completely (buttons handle navigation)
    const onTouchMove = (e: TouchEvent) => {
      if (window.innerWidth >= 768) return
      // Allow scrolling inside terminal only if it has overflow
      const target = e.target as HTMLElement
      const terminalScroll = target.closest('[data-terminal-scroll]') as HTMLElement
      if (terminalScroll && terminalScroll.scrollHeight > terminalScroll.clientHeight) {
        // Only allow if not at scroll boundaries (prevent page scroll bleed)
        const atTop = terminalScroll.scrollTop <= 0
        const atBottom = terminalScroll.scrollTop + terminalScroll.clientHeight >= terminalScroll.scrollHeight - 1
        const touch = e.touches[0]
        const isScrollingDown = touch && (touch as Touch).clientY < (terminalScroll as any)._lastTouchY
        ;(terminalScroll as any)._lastTouchY = touch?.clientY

        if ((atTop && !isScrollingDown) || (atBottom && isScrollingDown)) {
          // At boundary, don't scroll the page
        } else {
          return // allow terminal scroll
        }
      }
      e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('touchmove', onTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('touchmove', onTouchMove)
    }
  }, [enabled, navigate])

  // Update current index on scroll (for button state)
  useEffect(() => {
    const onScroll = () => {
      const points = getSnapPoints()
      setCurrentIdx(findCurrentIndex(points))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [getSnapPoints, findCurrentIndex])

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!enabled) return null

  // Only render (and touch `document`) on the client — avoids SSR "document is not defined".
  if (!mounted) return null

  // Navigation buttons — shown on both desktop and mobile
  const points = getSnapPoints()
  const isFirst = currentIdx <= 0
  const isLast = currentIdx >= points.length - 1

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          disabled={isFirst || isAnimating}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-nav/60 transition-[opacity,transform] cursor-pointer disabled:cursor-default active:scale-90
            ${pressed === 'up' ? 'scale-90' : ''}
            ${isFirst ? 'opacity-0' : isAnimating ? 'opacity-30' : 'opacity-60 active:opacity-100'}`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <div className="relative">
          {/* soft attention pulse behind the key (hidden while scrolling) */}
          {!isLast && !isAnimating && (
            <span aria-hidden="true" className="absolute -inset-1 rounded-xl bg-orange-500/25 blur-md animate-pulse" />
          )}
          <button
            onClick={() => navigate(1)}
            disabled={isLast || isAnimating}
            className={`relative w-14 h-12 flex items-center justify-center rounded-xl bg-nav border-t border-white/15 cursor-pointer disabled:cursor-default transition-[transform,box-shadow,opacity] duration-100
              active:translate-y-[3px] active:shadow-[0_1px_0_0_var(--bg-nav-hover)]
              ${pressed === 'down' ? 'translate-y-[3px] shadow-[0_1px_0_0_var(--bg-nav-hover)]' : 'shadow-[0_4px_0_0_var(--bg-nav-hover)]'}
              ${isLast || isAnimating ? 'opacity-40' : 'opacity-100'}`}
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>
    </>
  )
}
