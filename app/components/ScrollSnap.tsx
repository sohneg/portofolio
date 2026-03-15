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
  const [isMobile, setIsMobile] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)

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
    isAnimatingRef.current = true
    const start = window.scrollY
    const dist = target - start
    if (Math.abs(dist) < 5) {
      isAnimatingRef.current = false
      return
    }

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

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    // Desktop: wheel snap
    const onWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current || cooldownRef.current) {
        e.preventDefault()
        return
      }
      if (Math.abs(e.deltaY) < 10) return
      e.preventDefault()
      navigate(e.deltaY > 0 ? 1 : -1)
    }

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current || cooldownRef.current) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== ' ' && e.key !== 'PageDown' && e.key !== 'PageUp') return
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return
      e.preventDefault()
      const direction = (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') ? 1 : -1
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
      window.removeEventListener('resize', checkMobile)
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

  if (!enabled) return null

  // Mobile: show nav buttons
  if (!isMobile) return null

  const points = getSnapPoints()
  const isFirst = currentIdx <= 0
  const isLast = currentIdx >= points.length - 1

  return (
    <>
      <style>{`
        @keyframes rainbow-pulse {
          0%, 100% { box-shadow: 0 0 8px 2px rgba(249,115,22,0.5), 0 0 16px 4px rgba(249,115,22,0.2); transform: scale(1); }
          33% { box-shadow: 0 0 8px 2px rgba(168,85,247,0.5), 0 0 16px 4px rgba(168,85,247,0.2); transform: scale(1); }
          66% { box-shadow: 0 0 8px 2px rgba(59,130,246,0.5), 0 0 16px 4px rgba(59,130,246,0.2); transform: scale(1); }
        }
        @keyframes rainbow-pump {
          0%, 100% { box-shadow: 0 0 10px 3px rgba(249,115,22,0.6), 0 0 20px 6px rgba(249,115,22,0.3); transform: scale(1); }
          16% { box-shadow: 0 0 12px 4px rgba(168,85,247,0.6), 0 0 24px 8px rgba(168,85,247,0.3); transform: scale(1.12); }
          33% { box-shadow: 0 0 10px 3px rgba(59,130,246,0.6), 0 0 20px 6px rgba(59,130,246,0.3); transform: scale(1); }
          50% { box-shadow: 0 0 12px 4px rgba(16,185,129,0.6), 0 0 24px 8px rgba(16,185,129,0.3); transform: scale(1.12); }
          66% { box-shadow: 0 0 10px 3px rgba(249,115,22,0.6), 0 0 20px 6px rgba(249,115,22,0.3); transform: scale(1); }
          83% { box-shadow: 0 0 12px 4px rgba(168,85,247,0.6), 0 0 24px 8px rgba(168,85,247,0.3); transform: scale(1.12); }
        }
      `}</style>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2">
        <button
          onClick={() => navigate(1)}
          disabled={isLast}
          className={`w-14 h-14 flex items-center justify-center rounded-full bg-nav transition-opacity
            ${isLast ? 'opacity-30' : 'opacity-90 active:opacity-100'}`}
          style={!isLast ? { animation: `${isFirst ? 'rainbow-pump' : 'rainbow-pulse'} 3s ease-in-out infinite` } : undefined}
        >
          <ChevronDown className="w-7 h-7" />
        </button>
        <button
          onClick={() => navigate(-1)}
          disabled={isFirst}
          className={`w-10 h-10 flex items-center justify-center rounded-full bg-nav/60 transition-opacity
            ${isFirst ? 'opacity-0' : 'opacity-60 active:opacity-100'}`}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>
    </>
  )
}
