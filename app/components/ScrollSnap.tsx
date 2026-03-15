'use client'

import { useEffect, useRef } from 'react'

interface ScrollSnapProps {
  targets: string[]
  noSnapZone?: string
  debounce?: number
  enabled?: boolean
}

/**
 * Forward-only scroll snap.
 * When user stops scrolling, glide to the nearest keyframe AHEAD.
 * Never snaps backward.
 */
export default function ScrollSnap({
  targets,
  noSnapZone,
  debounce = 150,
  enabled = true,
}: ScrollSnapProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isSnappingRef = useRef(false)
  const lastScrollRef = useRef(0)
  const directionRef = useRef<'down' | 'up'>('down')

  useEffect(() => {
    if (!enabled) return

    const getSnapPoints = (): number[] => {
      const points: number[] = [0]

      // Add zone keyframes
      if (noSnapZone) {
        const zone = document.querySelector(noSnapZone) as HTMLElement
        if (zone) {
          const zoneTop = zone.offsetTop
          const zoneScrollable = zone.offsetHeight - window.innerHeight
          // Baker text visible keyframe
          points.push(zoneTop + zoneScrollable * 0.65)
        }
      }

      // Section snap points
      targets.forEach(selector => {
        const el = document.querySelector(selector) as HTMLElement
        if (el) {
          // Snap so section is centered
          points.push(el.offsetTop - (window.innerHeight - el.offsetHeight) / 2)
        }
      })

      return points.sort((a, b) => a - b)
    }

    const snapToNearest = () => {
      if (isSnappingRef.current) return

      const scrollY = window.scrollY
      const points = getSnapPoints()
      if (points.length === 0) return

      // Find nearest point in the scroll direction
      let target: number | null = null

      if (directionRef.current === 'down') {
        // Find next point ahead (or very close behind within 50px)
        for (const p of points) {
          if (p >= scrollY - 50) {
            target = p
            break
          }
        }
      } else {
        // Scrolling up: find previous point
        for (let i = points.length - 1; i >= 0; i--) {
          if (points[i] <= scrollY + 50) {
            target = points[i]
            break
          }
        }
      }

      if (target === null) return
      const dist = Math.abs(scrollY - target)

      // Skip if already there
      if (dist < 5) return

      // Don't snap over huge distances (but allow longer snaps inside the zoom zone)
      const inZone = noSnapZone && (() => {
        const zone = document.querySelector(noSnapZone) as HTMLElement
        if (!zone) return false
        const zoneTop = zone.offsetTop
        const zoneEnd = zoneTop + zone.offsetHeight
        return scrollY >= zoneTop - window.innerHeight && scrollY <= zoneEnd
      })()
      const maxSnapDist = inZone ? Infinity : window.innerHeight * 1.5
      if (dist > maxSnapDist) return

      isSnappingRef.current = true

      // Custom eased scroll - longer duration inside zoom zone for reading keywords
      const start = scrollY
      const totalDist = target - start
      const duration = inZone
        ? Math.min(6000, Math.max(2000, dist * 1.5))
        : Math.min(1200, Math.max(400, dist * 0.8))
      const startTime = performance.now()

      const animate = (now: number) => {
        const elapsed = now - startTime
        const t = Math.min(1, elapsed / duration)
        const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
        window.scrollTo(0, start + totalDist * eased)
        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          isSnappingRef.current = false
        }
      }
      requestAnimationFrame(animate)
    }

    const onScroll = () => {
      if (isSnappingRef.current) return

      const scrollY = window.scrollY
      directionRef.current = scrollY > lastScrollRef.current ? 'down' : 'up'
      lastScrollRef.current = scrollY

      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(snapToNearest, debounce)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [targets, noSnapZone, debounce, enabled])

  return null
}
