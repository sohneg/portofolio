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
    radial-gradient(circle 400px at 10% 20%, rgba(255,23,68,0.8) 0%, transparent 70%),
    radial-gradient(circle 300px at 90% 10%, rgba(0,229,255,0.7) 0%, transparent 70%),
    radial-gradient(circle 500px at 60% 90%, rgba(0,230,118,0.7) 0%, transparent 70%),
    radial-gradient(circle 250px at 30% 60%, rgba(255,234,0,0.6) 0%, transparent 60%),
    radial-gradient(circle 350px at 80% 55%, rgba(213,0,249,0.7) 0%, transparent 70%),
    radial-gradient(circle 450px at 5% 85%, rgba(41,121,255,0.8) 0%, transparent 70%),
    radial-gradient(circle 300px at 50% 30%, rgba(255,145,0,0.6) 0%, transparent 60%),
    radial-gradient(circle 200px at 70% 15%, rgba(255,23,68,0.5) 0%, transparent 65%),
    radial-gradient(circle 350px at 40% 45%, rgba(0,229,255,0.4) 0%, transparent 70%),
    radial-gradient(circle 280px at 20% 95%, rgba(213,0,249,0.5) 0%, transparent 65%),
    radial-gradient(circle 320px at 95% 80%, rgba(0,230,118,0.6) 0%, transparent 70%)`

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
