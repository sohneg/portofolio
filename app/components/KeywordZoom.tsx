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

interface ScatterUnit {
  dx: number
  dy: number
  rotation: number
}

// Deterministic pseudo-random to avoid SSR/client hydration mismatch
// Round to 6 decimal places to prevent floating-point divergence between server/client
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297
  return Math.round((x - Math.floor(x)) * 1000000) / 1000000
}

/** Split text into words (preserving spaces as part of the preceding word) for mobile,
 *  or characters for desktop. Returns array of token strings. */
function splitForScatter(text: string, isMobile: boolean): string[] {
  if (!text) return []
  if (!isMobile) return text.split('')
  // Word-level: split on spaces but keep spaces attached to previous token
  return text.split(/(?<=\s)|(?=\S+)/).filter(Boolean).reduce<string[]>((acc, token) => {
    // Merge consecutive whitespace tokens into a single space
    if (/^\s+$/.test(token) && acc.length > 0) {
      acc[acc.length - 1] += token
    } else {
      acc.push(token)
    }
    return acc
  }, [])
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
  const lastPRef = useRef(-1) // track last scroll progress to skip redundant frames

  const isMobile = false

  // 3 breads thrown from bottom-left in an arc through the text
  const breads = useMemo(() => [
    { delay: 0, startX: -30, startY: 85, rotEnd: -45, scale: 1.1 },
    { delay: 0.02, startX: -20, startY: 90, rotEnd: -35, scale: 0.9 },
    { delay: 0.035, startX: -25, startY: 95, rotEnd: -55, scale: 1.0 },
  ], [])
  const scatterRef = useRef<HTMLDivElement>(null)
  const scatterCacheRef = useRef<{ el: HTMLElement; dx: number; dy: number; rot: number }[] | null>(null)
  const crumbRefs = useRef<(HTMLDivElement | null)[]>([])
  const [breadImgs, setBreadImgs] = useState<(string | null)[]>([null, null, null])

  // Split text into scatter tokens (words on mobile, chars on desktop)
  const titleTokens = useMemo(() => splitForScatter(flyInTitle || '', isMobile), [flyInTitle, isMobile])
  const textTokens = useMemo(() => splitForScatter(flyInText || '', isMobile), [flyInText, isMobile])

  // Generate scatter data - large values so chars fly completely off screen
  const titleScatter = useMemo<ScatterUnit[]>(() =>
    titleTokens.map((_, i) => ({
      dx: (seededRandom(i * 3 + 1) - 0.5) * 3000,
      dy: (seededRandom(i * 3 + 2) - 0.5) * 2500,
      rotation: (seededRandom(i * 3 + 3) - 0.5) * 720,
    })), [titleTokens])

  const textScatter = useMemo<ScatterUnit[]>(() =>
    textTokens.map((_, i) => ({
      dx: (seededRandom(i * 3 + 1000) - 0.5) * 3000,
      dy: (seededRandom(i * 3 + 1001) - 0.5) * 2500,
      rotation: (seededRandom(i * 3 + 1002) - 0.5) * 720,
    })), [textTokens])

  // Fewer crumbs on mobile
  const crumbCount = isMobile ? 8 : 15
  const crumbs = useMemo(() =>
    Array.from({ length: crumbCount }, (_, i) => ({
      dx: (seededRandom(i * 4 + 2000) - 0.5) * 500,
      dy: (seededRandom(i * 4 + 2001) - 0.3) * 400,
      size: 3 + seededRandom(i * 4 + 2002) * 8,
      rotation: seededRandom(i * 4 + 2003) * 360,
    })), [crumbCount])

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

      // Skip frame if progress hasn't meaningfully changed (reduces work on mobile)
      const pRounded = Math.round(p * 10000) / 10000
      if (pRounded === lastPRef.current) {
        rafRef.current = requestAnimationFrame(update)
        return
      }
      lastPRef.current = pRounded

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

        el.style.transform = `translateZ(${z}px)`
        el.style.opacity = String(opacity)
      })

      // === PHASE 2: Baker fly-in (0.45 - 0.65) ===
      const flyEl = flyInElRef.current
      if (flyEl) {
        const flyStart = 0.45
        const flyEnd = 0.65
        const flyT = Math.max(0, Math.min(1, (p - flyStart) / (flyEnd - flyStart)))

        if (p < 0.92) {
          const z = -800 + flyT * 800
          const opacity = flyT < 0.3 ? flyT / 0.3 : 1

          flyEl.style.transform = `translateZ(${z}px)`
          flyEl.style.opacity = String(opacity)
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
          const arcHeight = -25 // how high the arc peaks above center
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
        const impactP = 0.92
        if (p >= impactP) {
          scatterEl.style.display = ''
          const scatter = (p - impactP) / 0.15 // no cap - keeps flying

          // Shake on impact
          const shake = p >= impactP && p < impactP + 0.015
          const shakeX = shake ? Math.sin(p * 300) * 12 * (1 - (p - impactP) / 0.015) : 0
          const shakeY = shake ? Math.cos(p * 300) * 8 * (1 - (p - impactP) / 0.015) : 0

          scatterEl.style.transform = `translate(${shakeX}px, ${shakeY}px)`

          // Update each character span (cached)
          if (!scatterCacheRef.current) {
            const chars = scatterEl.querySelectorAll('[data-scatter]')
            scatterCacheRef.current = Array.from(chars).map(ch => {
              const el = ch as HTMLElement
              return {
                el,
                dx: parseFloat(el.dataset.dx || '0'),
                dy: parseFloat(el.dataset.dy || '0'),
                rot: parseFloat(el.dataset.rot || '0'),
              }
            })
          }
          const fadeOut = Math.max(0, 1 - scatter * 2.5)
          for (const c of scatterCacheRef.current) {
            c.el.style.transform = `translate(${c.dx * scatter}px, ${c.dy * scatter}px) rotate(${c.rot * scatter}deg)`
            c.el.style.opacity = String(fadeOut)
          }
          // Hide whole container once fully faded
          if (fadeOut <= 0) scatterEl.style.display = 'none'
        } else {
          scatterEl.style.display = 'none'
        }
      }

      // Crumbs
      crumbRefs.current.forEach((el, i) => {
        if (!el) return
        const crumbStart = 0.92
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
    <div ref={containerRef} data-keyword-zoom style={{ height: '600vh', overflow: 'clip' }}>
      <div
        className="sticky top-0 z-[2]"
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
              willChange: 'transform, opacity',
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
            className="absolute inset-0 flex items-start pt-[20vh] md:items-center md:pt-0 justify-center px-8 md:px-8 md:pl-24"
            style={{
              transformStyle: 'preserve-3d',
              opacity: 0,
              willChange: 'transform, opacity',
            }}
          >
            <div className="max-w-2xl mx-auto text-center">
              {flyInContent}
            </div>
          </div>
        )}

        {/* Scatter version of baker text */}
        {flyInTitle && flyInText && (
          <div
            ref={scatterRef}
            className="absolute inset-0 flex items-start pt-[20vh] md:items-center md:pt-0 justify-center px-2 md:px-8 md:pl-24 overflow-hidden"
            style={{ display: 'none', zIndex: 30 }}
          >
            <div className="max-w-2xl mx-auto text-center font-serif">
              <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">
                {titleTokens.map((token, i) => (
                  <span
                    key={i}
                    data-scatter
                    data-dx={titleScatter[i]?.dx || 0}
                    data-dy={titleScatter[i]?.dy || 0}
                    data-rot={titleScatter[i]?.rotation || 0}
                    className="inline-block"
                    style={{ willChange: 'transform' }}
                  >
                    {token.replace(/ /g, '\u00A0')}
                  </span>
                ))}
              </h2>
              <p className="text-sm md:text-xl leading-relaxed opacity-80">
                {textTokens.map((token, i) => (
                  <span
                    key={i}
                    data-scatter
                    data-dx={textScatter[i]?.dx || 0}
                    data-dy={textScatter[i]?.dy || 0}
                    data-rot={textScatter[i]?.rotation || 0}
                    className="inline-block"
                    style={{ willChange: 'transform' }}
                  >
                    {token.replace(/ /g, '\u00A0')}
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
