'use client'

import { useEffect, useRef, type ReactNode } from 'react'

interface KW {
  text: string
  row: number
  col: number
  start: number
  duration: number
  special?: boolean
}

const items: KW[] = [
  { text: 'Sauerteig', row: 1, col: 1, start: 0.02, duration: 0.12 },
  { text: 'Brot', row: 1, col: 3, start: 0.08, duration: 0.12 },
  { text: 'Handwerk', row: 3, col: 4, start: 0.0, duration: 0.14 },
  { text: 'Mehl', row: 4, col: 2, start: 0.05, duration: 0.12 },
  { text: '4:00 Uhr', row: 2, col: 1, start: 0.1, duration: 0.12 },
  { text: 'Plan B', row: 1, col: 4, start: 0.15, duration: 0.12 },
  { text: 'Neustart', row: 4, col: 1, start: 0.18, duration: 0.12 },
  { text: 'Simon', row: 2, col: 2, start: 0.15, duration: 0.4, special: true },
  { text: 'React', row: 1, col: 2, start: 0.22, duration: 0.12 },
  { text: 'Next.js', row: 3, col: 1, start: 0.26, duration: 0.12 },
  { text: 'TypeScript', row: 2, col: 4, start: 0.3, duration: 0.12 },
  { text: 'Node.js', row: 4, col: 3, start: 0.34, duration: 0.12 },
  { text: 'VR', row: 1, col: 1, start: 0.38, duration: 0.12 },
  { text: 'Tuning Schweiz', row: 3, col: 2, start: 0.42, duration: 0.12 },
  { text: 'Raspberry Pi', row: 2, col: 1, start: 0.46, duration: 0.12 },
  { text: 'Games', row: 4, col: 4, start: 0.5, duration: 0.12 },
  { text: '8500+', row: 1, col: 3, start: 0.44, duration: 0.12 },
  { text: 'Sonex', row: 3, col: 3, start: 0.54, duration: 0.12 },
  { text: 'VRChat', row: 2, col: 3, start: 0.58, duration: 0.12 },
  { text: 'Ari & Luci', row: 4, col: 1, start: 0.62, duration: 0.12 },
  { text: 'Cookies', row: 1, col: 4, start: 0.66, duration: 0.12 },
  { text: 'Code', row: 3, col: 1, start: 0.7, duration: 0.12 },
  { text: '</>', row: 2, col: 4, start: 0.58, duration: 0.12 },
  { text: 'Fullstack', row: 4, col: 2, start: 0.52, duration: 0.12 },
  { text: 'Swiss Made', row: 1, col: 2, start: 0.6, duration: 0.12 },
  { text: 'Kreativ', row: 3, col: 4, start: 0.48, duration: 0.12 },
  { text: 'Community', row: 2, col: 2, start: 0.36, duration: 0.12 },
  { text: 'Musik', row: 4, col: 3, start: 0.56, duration: 0.14 },
  { text: 'Leidenschaft', row: 1, col: 1, start: 0.64, duration: 0.12 },
  { text: 'Brabender', row: 2, col: 1, start: 0.32, duration: 0.12 },
  { text: 'Pomsky', row: 3, col: 2, start: 0.68, duration: 0.12 },
]

interface KeywordZoomProps {
  children?: ReactNode
  /** Content that flies in at the end and stays */
  flyInContent?: ReactNode
  /** Ref for the fly-in section (for intersection observer etc.) */
  flyInRef?: React.Ref<HTMLDivElement>
}

export default function KeywordZoom({ children, flyInContent, flyInRef }: KeywordZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const flyInElRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      const container = containerRef.current
      if (!container) {
        rafRef.current = requestAnimationFrame(update)
        return
      }

      const rect = container.getBoundingClientRect()
      const scrollable = container.offsetHeight - window.innerHeight
      if (scrollable <= 0) {
        rafRef.current = requestAnimationFrame(update)
        return
      }

      const p = Math.max(0, Math.min(1, -rect.top / scrollable))

      // Update keywords
      itemRefs.current.forEach((el, i) => {
        if (!el) return
        const kw = items[i]
        const localT = (p - kw.start) / kw.duration

        if (localT < 0 || localT > 1) {
          el.style.opacity = '0'
          return
        }

        const z = -1000 + localT * 2000
        const opacity = localT < 0.3
          ? localT / 0.3
          : localT > 0.7
            ? (1 - localT) / 0.3
            : 1
        const blur = localT < 0.2
          ? (1 - localT / 0.2) * 5
          : localT > 0.8
            ? ((localT - 0.8) / 0.2) * 5
            : 0

        el.style.transform = `translateZ(${z}px)`
        el.style.opacity = String(opacity)
        el.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none'
      })

      // Update fly-in content (baker section): flies in during progress 0.7 → 1.0
      const flyEl = flyInElRef.current
      if (flyEl) {
        const flyStart = 0.7
        const flyT = Math.max(0, Math.min(1, (p - flyStart) / (1 - flyStart)))

        const z = -800 + flyT * 800 // -800 → 0
        const opacity = flyT < 0.4 ? flyT / 0.4 : 1
        const blur = flyT < 0.5 ? (1 - flyT / 0.5) * 6 : 0

        flyEl.style.transform = `translateZ(${z}px)`
        flyEl.style.opacity = String(opacity)
        flyEl.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none'
      }

      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div ref={containerRef} style={{ height: '400vh' }}>
      <div
        className="sticky top-0 overflow-clip z-[2]"
        style={{
          height: '100svh',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          display: 'grid',
          gridTemplate: 'repeat(4, 25dvh) / repeat(4, 25dvw)',
          placeItems: 'center',
        }}
      >
        {/* Keywords */}
        {items.map((kw, i) => (
          <div
            key={i}
            ref={(el) => { itemRefs.current[i] = el }}
            className="text-nowrap"
            style={{
              transformStyle: 'preserve-3d',
              fontSize: kw.special ? '15vmin' : '5vmin',
              fontWeight: kw.special ? 'bold' : 300,
              gridArea: kw.special
                ? '2 / 2 / span 2 / span 2'
                : `${kw.row} / ${kw.col}`,
              opacity: 0,
              willChange: 'transform, opacity, filter',
            }}
          >
            {kw.special ? <b>{kw.text}</b> : kw.text}
          </div>
        ))}

        {/* Fly-in content (baker section) - centered overlay */}
        {flyInContent && (
          <div
            ref={(el) => {
              flyInElRef.current = el
              // Forward ref for section tracking
              if (typeof flyInRef === 'function') flyInRef(el)
              else if (flyInRef && 'current' in flyInRef) (flyInRef as React.MutableRefObject<HTMLDivElement | null>).current = el
            }}
            className="absolute inset-0 flex items-center justify-center px-8 md:pl-24"
            style={{
              transformStyle: 'preserve-3d',
              opacity: 0,
              willChange: 'transform, opacity, filter',
            }}
          >
            <div className="max-w-2xl mx-auto text-center">
              {flyInContent}
            </div>
          </div>
        )}

        {/* Hero overlay */}
        {children}
      </div>
    </div>
  )
}
