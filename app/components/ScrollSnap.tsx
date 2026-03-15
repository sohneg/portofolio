'use client'

import { useEffect, useRef } from 'react'

interface ScrollSnapProps {
  targets: string[]
  noSnapZone?: string
  enabled?: boolean
}

/**
 * Trigger-based scroll snap.
 * First scroll/wheel event triggers animation to next/prev keyframe.
 * Further scroll input is ignored until animation completes.
 * Works like a slideshow controlled by scroll direction.
 */
export default function ScrollSnap({
  targets,
  noSnapZone,
  enabled = true,
}: ScrollSnapProps) {
  const isAnimatingRef = useRef(false)
  const currentPointRef = useRef(0)
  const cooldownRef = useRef(false)

  useEffect(() => {
    if (!enabled) return

    const getSnapPoints = (): number[] => {
      const points: number[] = [0]

      if (noSnapZone) {
        const zone = document.querySelector(noSnapZone) as HTMLElement
        if (zone) {
          const zoneTop = zone.offsetTop
          const zoneScrollable = zone.offsetHeight - window.innerHeight
          points.push(zoneTop + zoneScrollable * 0.65)
        }
      }

      targets.forEach(selector => {
        const el = document.querySelector(selector) as HTMLElement
        if (el) {
          points.push(el.offsetTop - (window.innerHeight - el.offsetHeight) / 2)
        }
      })

      return points.sort((a, b) => a - b)
    }

    // Find which keyframe we're closest to
    const findCurrentIndex = (points: number[]): number => {
      const scrollY = window.scrollY
      let bestIdx = 0
      let bestDist = Infinity
      for (let i = 0; i < points.length; i++) {
        const dist = Math.abs(scrollY - points[i])
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = i
        }
      }
      return bestIdx
    }

    const animateTo = (target: number, duration: number) => {
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
          // Short cooldown to prevent immediate re-trigger
          cooldownRef.current = true
          setTimeout(() => {
            isAnimatingRef.current = false
            cooldownRef.current = false
          }, 200)
        }
      }
      requestAnimationFrame(animate)
    }

    const onWheel = (e: WheelEvent) => {
      if (isAnimatingRef.current || cooldownRef.current) {
        e.preventDefault()
        return
      }

      // Only trigger on meaningful scroll (not tiny trackpad ticks)
      if (Math.abs(e.deltaY) < 10) return

      e.preventDefault()

      const points = getSnapPoints()
      const currentIdx = findCurrentIndex(points)
      const direction = e.deltaY > 0 ? 1 : -1
      const nextIdx = Math.max(0, Math.min(points.length - 1, currentIdx + direction))

      if (nextIdx === currentIdx) return

      const target = points[nextIdx]
      const dist = Math.abs(target - window.scrollY)

      // Longer duration for zoom zone (keywords need reading time)
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

      currentPointRef.current = nextIdx
      animateTo(target, duration)
    }

    // Touch support
    let touchStartY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (isAnimatingRef.current || cooldownRef.current) return

      const touchEndY = e.changedTouches[0].clientY
      const diff = touchStartY - touchEndY

      // Need minimum swipe distance
      if (Math.abs(diff) < 30) return

      const points = getSnapPoints()
      const currentIdx = findCurrentIndex(points)
      const direction = diff > 0 ? 1 : -1
      const nextIdx = Math.max(0, Math.min(points.length - 1, currentIdx + direction))

      if (nextIdx === currentIdx) return

      const target = points[nextIdx]
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

      currentPointRef.current = nextIdx
      animateTo(target, duration)
    }

    // Keyboard support
    const onKeyDown = (e: KeyboardEvent) => {
      if (isAnimatingRef.current || cooldownRef.current) return
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== ' ' && e.key !== 'PageDown' && e.key !== 'PageUp') return

      // Don't hijack keyboard if user is in terminal input
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return

      e.preventDefault()

      const points = getSnapPoints()
      const currentIdx = findCurrentIndex(points)
      const direction = (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') ? 1 : -1
      const nextIdx = Math.max(0, Math.min(points.length - 1, currentIdx + direction))

      if (nextIdx === currentIdx) return

      const target = points[nextIdx]
      const dist = Math.abs(target - window.scrollY)

      const inZone = noSnapZone && (() => {
        const zone = document.querySelector(noSnapZone) as HTMLElement
        if (!zone) return false
        const zoneTop = zone.offsetTop
        const zoneEnd = zoneTop + zone.offsetHeight
        return window.scrollY >= zoneTop - window.innerHeight && target <= zoneEnd
      })()

      const duration = inZone
        ? Math.min(4000, Math.max(1500, dist * 1.0))
        : Math.min(1000, Math.max(400, dist * 0.6))

      currentPointRef.current = nextIdx
      animateTo(target, duration)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [targets, noSnapZone, enabled])

  return null
}
