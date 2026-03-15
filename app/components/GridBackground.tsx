'use client'

import { useEffect, useRef } from 'react'

interface GridBackgroundProps {
  filterId: string
  filterSeed?: number
  filterFrequency?: number
  filterSlope?: number
  filterIntercept?: number
  fixed?: boolean
  maskImage?: string
  style?: React.CSSProperties
}

const gridPattern = `
  repeating-linear-gradient(to bottom, transparent, transparent 19px, var(--text-secondary) 19px, var(--text-secondary) 20px),
  repeating-linear-gradient(to right, transparent, transparent 19px, var(--text-secondary) 19px, var(--text-secondary) 20px)
`

const gridMask = `
  repeating-linear-gradient(to bottom, transparent 0px, transparent 19px, black 19px, black 20px),
  repeating-linear-gradient(to right, transparent 0px, transparent 19px, black 19px, black 20px)
`

export default function GridBackground({
  filterId,
  filterSeed = 123,
  filterFrequency = 0.012,
  filterSlope = 2,
  filterIntercept = -0.5,
  fixed = false,
  maskImage = 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
  style = {},
}: GridBackgroundProps) {
  const spotlightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = spotlightRef.current
    if (!el) return

    const handleMouseMove = (e: MouseEvent) => {
      el.style.setProperty('--mx', `${e.clientX}px`)
      el.style.setProperty('--my', `${e.clientY}px`)
      el.style.opacity = '1'
    }

    const handleMouseLeave = () => {
      el.style.opacity = '0'
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const positionClass = fixed ? 'fixed' : 'absolute'

  const rainbow = `
    radial-gradient(ellipse at 15% 50%, #ff1744 0%, transparent 50%),
    radial-gradient(ellipse at 85% 15%, #00e5ff 0%, transparent 50%),
    radial-gradient(ellipse at 50% 85%, #00e676 0%, transparent 50%),
    radial-gradient(ellipse at 25% 10%, #ffea00 0%, transparent 50%),
    radial-gradient(ellipse at 75% 70%, #d500f9 0%, transparent 50%),
    radial-gradient(ellipse at 10% 80%, #2979ff 0%, transparent 50%),
    radial-gradient(ellipse at 90% 40%, #ff9100 0%, transparent 50%)`

  const spotlightMask = `radial-gradient(circle 200px at var(--mx, -200px) var(--my, -200px), black 0%, transparent 100%)`

  return (
    <>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency={filterFrequency} numOctaves={3} seed={filterSeed} result="noise" />
            <feComponentTransfer in="noise" result="fade">
              <feFuncA type="linear" slope={filterSlope} intercept={filterIntercept} />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="fade" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Base grid */}
      <div
        className={`${positionClass} inset-0 pointer-events-none`}
        style={{
          backgroundImage: gridPattern,
          opacity: 0.25,
          filter: `url(#${filterId})`,
          maskImage,
          WebkitMaskImage: maskImage,
          ...style,
        }}
      />

      {/* Rainbow spotlight */}
      <div
        ref={spotlightRef}
        className={`${positionClass} inset-0 pointer-events-none transition-opacity duration-300`}
        style={{
          opacity: 0,
          maskImage: spotlightMask,
          WebkitMaskImage: spotlightMask,
          ...style,
        }}
      >
        {/* Glow layer */}
        <div
          className="absolute inset-0"
          style={{
            background: rainbow,
            maskImage: gridMask,
            WebkitMaskImage: gridMask,
            filter: 'blur(3px)',
            opacity: 0.3,
          }}
        />
        {/* Sharp lines */}
        <div
          className="absolute inset-0"
          style={{
            background: rainbow,
            maskImage: gridMask,
            WebkitMaskImage: gridMask,
            opacity: 0.4,
          }}
        />
      </div>
    </>
  )
}
