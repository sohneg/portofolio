'use client'

import { useEffect, useRef, useMemo, useState, type ReactNode } from 'react'

interface KW {
  text: string
  row: number
  col: number
  start: number
  duration: number
  special?: boolean
}

const items: KW[] = [
  { text: 'Sauerteig', row: 1, col: 1, start: 0.01, duration: 0.08 },
  { text: 'Brot', row: 1, col: 3, start: 0.05, duration: 0.08 },
  { text: 'Handwerk', row: 3, col: 4, start: 0.0, duration: 0.09 },
  { text: 'Mehl', row: 4, col: 2, start: 0.03, duration: 0.08 },
  { text: '4:00 Uhr', row: 2, col: 1, start: 0.07, duration: 0.08 },
  { text: 'Plan B', row: 1, col: 4, start: 0.1, duration: 0.08 },
  { text: 'Neustart', row: 4, col: 1, start: 0.12, duration: 0.08 },
  { text: 'Simon', row: 2, col: 2, start: 0.1, duration: 0.28, special: true },
  { text: 'React', row: 1, col: 2, start: 0.15, duration: 0.08 },
  { text: 'Next.js', row: 3, col: 1, start: 0.17, duration: 0.08 },
  { text: 'TypeScript', row: 2, col: 4, start: 0.2, duration: 0.08 },
  { text: 'Node.js', row: 4, col: 3, start: 0.22, duration: 0.08 },
  { text: 'VR', row: 1, col: 1, start: 0.25, duration: 0.08 },
  { text: 'Tuning Schweiz', row: 3, col: 2, start: 0.28, duration: 0.08 },
  { text: 'Raspberry Pi', row: 2, col: 1, start: 0.3, duration: 0.08 },
  { text: 'Games', row: 4, col: 4, start: 0.33, duration: 0.08 },
  { text: '8500+', row: 1, col: 3, start: 0.29, duration: 0.08 },
  { text: 'Sonex', row: 3, col: 3, start: 0.35, duration: 0.08 },
  { text: 'VRChat', row: 2, col: 3, start: 0.37, duration: 0.08 },
  { text: 'Ari & Luci', row: 4, col: 1, start: 0.4, duration: 0.08 },
  { text: 'Cookies', row: 1, col: 4, start: 0.42, duration: 0.08 },
  { text: 'Code', row: 3, col: 1, start: 0.44, duration: 0.08 },
  { text: '</>', row: 2, col: 4, start: 0.37, duration: 0.08 },
  { text: 'Fullstack', row: 4, col: 2, start: 0.34, duration: 0.08 },
  { text: 'Swiss Made', row: 1, col: 2, start: 0.39, duration: 0.08 },
  { text: 'Kreativ', row: 3, col: 4, start: 0.32, duration: 0.08 },
  { text: 'Community', row: 2, col: 2, start: 0.24, duration: 0.08 },
  { text: 'Musik', row: 4, col: 3, start: 0.36, duration: 0.09 },
  { text: 'Leidenschaft', row: 1, col: 1, start: 0.41, duration: 0.08 },
  { text: 'Brabender', row: 2, col: 1, start: 0.21, duration: 0.08 },
  { text: 'Pomsky', row: 3, col: 2, start: 0.43, duration: 0.08 },
]

interface CharScatter {
  dx: number
  dy: number
  rotation: number
}

interface KeywordZoomProps {
  children?: ReactNode
  flyInContent?: ReactNode
  flyInRef?: React.Ref<HTMLDivElement>
  /** Title text for bread impact scatter */
  flyInTitle?: string
  /** Body text for bread impact scatter */
  flyInText?: string
}

export default function KeywordZoom({ children, flyInContent, flyInRef, flyInTitle, flyInText }: KeywordZoomProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const flyInElRef = useRef<HTMLDivElement>(null)
  const breadRefs = useRef<(HTMLDivElement | null)[]>([])

  // 3 breads thrown from bottom-left in an arc through the text
  const breads = useMemo(() => [
    { delay: 0, startX: -30, startY: 85, rotEnd: -45, scale: 1.1 },
    { delay: 0.02, startX: -20, startY: 90, rotEnd: -35, scale: 0.9 },
    { delay: 0.035, startX: -25, startY: 95, rotEnd: -55, scale: 1.0 },
  ], [])
  const scatterRef = useRef<HTMLDivElement>(null)
  const crumbRefs = useRef<(HTMLDivElement | null)[]>([])
  const [breadImgs, setBreadImgs] = useState<(string | null)[]>([null, null, null])

  // Generate scatter data for each character
  const titleScatter = useMemo<CharScatter[]>(() =>
    (flyInTitle || '').split('').map(() => ({
      dx: (Math.random() - 0.5) * 900,
      dy: (Math.random() - 0.5) * 700,
      rotation: (Math.random() - 0.5) * 720,
    })), [flyInTitle])

  const textScatter = useMemo<CharScatter[]>(() =>
    (flyInText || '').split('').map(() => ({
      dx: (Math.random() - 0.5) * 900,
      dy: (Math.random() - 0.5) * 700,
      rotation: (Math.random() - 0.5) * 720,
    })), [flyInText])

  const crumbs = useMemo(() =>
    Array.from({ length: 15 }, () => ({
      dx: (Math.random() - 0.5) * 500,
      dy: (Math.random() - 0.3) * 400,
      size: 3 + Math.random() * 8,
      rotation: Math.random() * 360,
    })), [])

  // Check for bread images
  useEffect(() => {
    [1, 2, 3].forEach((n, i) => {
      const img = new Image()
      img.onload = () => setBreadImgs(prev => {
        const next = [...prev]
        next[i] = `/bread_${n}.png`
        return next
      })
      img.onerror = () => {} // fallback to emoji
      img.src = `/bread_${n}.png`
    })
  }, [])

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

      // === PHASE 1: Keywords (0 - 0.5) ===
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

      // === PHASE 2: Baker fly-in (0.45 - 0.65) ===
      const flyEl = flyInElRef.current
      if (flyEl) {
        const flyStart = 0.45
        const flyEnd = 0.65
        const flyT = Math.max(0, Math.min(1, (p - flyStart) / (flyEnd - flyStart)))

        if (p < 0.91) {
          const z = -800 + flyT * 800
          const opacity = flyT < 0.3 ? flyT / 0.3 : 1
          const blur = flyT < 0.4 ? (1 - flyT / 0.4) * 6 : 0

          flyEl.style.transform = `translateZ(${z}px)`
          flyEl.style.opacity = String(opacity)
          flyEl.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none'
          flyEl.style.display = ''
        } else {
          flyEl.style.display = 'none'
        }
      }

      // === PHASE 3: Bread impact + scatter (0.72 - 1.0) ===
      const scatterEl = scatterRef.current

      // Animate each bread - arc from bottom-left, through center, continuing right-down
      breadRefs.current.forEach((bread, i) => {
        if (!bread) return
        const b = breads[i]
        const startP = 0.82 + b.delay
        const breadVisible = p >= startP
        const flyDuration = 0.14 // flight duration for the arc
        const breadFlyT = Math.max(0, Math.min(1, (p - startP) / flyDuration))
        // Impact is at ~halfway through the flight (when bread crosses center)
        const impactPoint = 0.45
        const impactT = breadFlyT >= impactPoint && breadFlyT < impactPoint + 0.1
          ? (breadFlyT - impactPoint) / 0.1 : 0

        if (breadVisible) {
          // Arc trajectory: start bottom-left, peak at center-top, exit right-down
          // X: from startX% → 50% (center) → 80% (right)
          const bx = b.startX + breadFlyT * (80 - b.startX)
          // Y: parabolic arc - starts low, peaks high at center, goes down again
          const arcHeight = -40 // how high the arc peaks above center
          const by = b.startY + breadFlyT * (70 - b.startY) + arcHeight * Math.sin(breadFlyT * Math.PI)

          const bScale = b.scale * (1 + Math.sin(breadFlyT * Math.PI) * 0.2)
          const bRotate = breadFlyT * b.rotEnd
          const bOpacity = breadFlyT < 0.1
            ? breadFlyT / 0.1
            : breadFlyT > 0.75
              ? Math.max(0, (1 - breadFlyT) / 0.25)
              : 1

          bread.style.left = `${bx}%`
          bread.style.top = `${by}%`
          bread.style.transform = `translate(-50%, -50%) scale(${bScale}) rotate(${bRotate}deg)`
          bread.style.opacity = String(bOpacity)
          bread.style.display = ''
        } else {
          bread.style.display = 'none'
        }
      })

      // Scatter - wait until breads have clearly passed through center
      // Bread 1 starts 0.82, duration 0.14, reaches ~60% of flight at 0.82+0.14*0.6=0.904
      if (scatterEl) {
        const impactP = 0.91
        if (p >= impactP) {
          scatterEl.style.display = ''
          const scatter = Math.min(1, (p - impactP) / 0.07)
          const fadeOut = p > 0.95 ? Math.max(0, 1 - (p - 0.95) / 0.05) : 1

          // Shake on impact
          const shake = p >= impactP && p < impactP + 0.015
          const shakeX = shake ? Math.sin(p * 300) * 12 * (1 - (p - impactP) / 0.015) : 0
          const shakeY = shake ? Math.cos(p * 300) * 8 * (1 - (p - impactP) / 0.015) : 0

          scatterEl.style.transform = `translate(${shakeX}px, ${shakeY}px)`
          scatterEl.style.opacity = String(fadeOut)

          // Update each character span
          const chars = scatterEl.querySelectorAll('[data-scatter]')
          chars.forEach((ch) => {
            const el = ch as HTMLElement
            const dx = parseFloat(el.dataset.dx || '0')
            const dy = parseFloat(el.dataset.dy || '0')
            const rot = parseFloat(el.dataset.rot || '0')
            el.style.transform = `translate(${dx * scatter}px, ${dy * scatter}px) rotate(${rot * scatter}deg)`
            el.style.opacity = String(1 - scatter * 0.6)
          })
        } else {
          scatterEl.style.display = 'none'
        }
      }

      // Crumbs
      crumbRefs.current.forEach((el, i) => {
        if (!el) return
        const crumbStart = 0.91
        if (p >= crumbStart) {
          const ct = Math.min(1, (p - crumbStart) / 0.15)
          const c = crumbs[i]
          el.style.transform = `translate(${c.dx * ct}px, ${c.dy * ct}px) rotate(${c.rotation * ct}deg)`
          el.style.opacity = String(Math.max(0, 1 - ct * 1.8))
          el.style.display = ''
        } else {
          el.style.display = 'none'
        }
      })

      rafRef.current = requestAnimationFrame(update)
    }

    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [crumbs])

  return (
    <div ref={containerRef} style={{ height: '600vh' }}>
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

        {/* Fly-in content (baker) */}
        {flyInContent && (
          <div
            ref={(el) => {
              flyInElRef.current = el
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

        {/* Scatter version of baker text (replaces fly-in on impact) */}
        {flyInTitle && flyInText && (
          <div
            ref={scatterRef}
            className="absolute inset-0 flex items-center justify-center px-8 md:pl-24"
            style={{ display: 'none' }}
          >
            <div className="max-w-2xl mx-auto text-center font-serif">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                {flyInTitle.split('').map((c, i) => (
                  <span
                    key={i}
                    data-scatter
                    data-dx={titleScatter[i]?.dx || 0}
                    data-dy={titleScatter[i]?.dy || 0}
                    data-rot={titleScatter[i]?.rotation || 0}
                    className="inline-block"
                  >
                    {c === ' ' ? '\u00A0' : c}
                  </span>
                ))}
              </h2>
              <p className="text-lg md:text-xl leading-relaxed opacity-80">
                {flyInText.split('').map((c, i) => (
                  <span
                    key={i}
                    data-scatter
                    data-dx={textScatter[i]?.dx || 0}
                    data-dy={textScatter[i]?.dy || 0}
                    data-rot={textScatter[i]?.rotation || 0}
                    className="inline-block"
                  >
                    {c === ' ' ? '\u00A0' : c}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}

        {/* Bread projectiles - 3 thrown from left */}
        {breads.map((_, i) => (
          <div
            key={`bread-${i}`}
            ref={(el) => { breadRefs.current[i] = el }}
            className="absolute select-none"
            style={{
              top: '50%',
              left: '-120%',
              display: 'none',
              zIndex: 20,
              willChange: 'transform, opacity',
            }}
          >
            {breadImgs[i] ? (
              <img src={breadImgs[i]!} alt="" className="w-20 h-20 md:w-28 md:h-28 object-contain" />
            ) : (
              <span className="text-6xl md:text-8xl">{['🍞', '🥖', '🥐'][i]}</span>
            )}
          </div>
        ))}

        {/* Crumbs */}
        {crumbs.map((_, i) => (
          <div
            key={i}
            ref={(el) => { crumbRefs.current[i] = el }}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: crumbs[i].size,
              height: crumbs[i].size,
              backgroundColor: '#d4a574',
              display: 'none',
              zIndex: 15,
            }}
          />
        ))}

        {/* Hero overlay */}
        {children}
      </div>
    </div>
  )
}
