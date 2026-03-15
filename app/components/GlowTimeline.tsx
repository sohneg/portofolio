'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from './ThemeProvider'

interface GlowTimelineProps {
  scrollProgress: number
  sectionPositions: number[]
  activeSections: Set<string>
  sectionIds: string[]
  height: number
}

function generateOrganicPath(height: number): string {
  const cx = 20
  const segments = 6
  const segH = height / segments
  let d = `M ${cx} 0`

  for (let i = 0; i < segments; i++) {
    const y2 = (i + 1) * segH
    const midY = (i * segH + y2) / 2
    const sway = (i % 2 === 0 ? 1 : -1) * 12
    d += ` C ${cx + sway} ${midY}, ${cx - sway} ${midY}, ${cx} ${y2}`
  }

  return d
}

export default function GlowTimeline({
  scrollProgress,
  sectionPositions,
  activeSections,
  sectionIds,
  height,
}: GlowTimelineProps) {
  const { theme } = useTheme()
  const pathRef = useRef<SVGPathElement>(null)
  const [totalLength, setTotalLength] = useState(0)
  const [dotPositions, setDotPositions] = useState<{ x: number; y: number }[]>(
    []
  )

  const pathD = useMemo(() => {
    if (height <= 0) return ''
    return generateOrganicPath(height)
  }, [height])

  // Measure path length and compute dot positions whenever path or section positions change
  useEffect(() => {
    const pathEl = pathRef.current
    if (!pathEl || height <= 0) return

    const len = pathEl.getTotalLength()
    setTotalLength(len)

    const positions = sectionPositions.map((t) => {
      const clamped = Math.max(0, Math.min(1, t))
      const pt = pathEl.getPointAtLength(clamped * len)
      return { x: pt.x, y: pt.y }
    })
    setDotPositions(positions)
  }, [pathD, sectionPositions, height])

  if (height <= 0) return null

  const dormantColor =
    theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'

  // Pulse gradient positioning along the path
  const pulseCenter = scrollProgress * totalLength
  const pulseHalf = 75 // half of the 150px pulse segment

  // For the activated trail: everything behind the pulse stays slightly lit
  const trailDash = totalLength > 0 ? pulseCenter : 0
  const trailGap = totalLength > 0 ? totalLength - pulseCenter : 0

  // Gradient y positions (userSpaceOnUse coordinates)
  // We approximate by mapping path length position to y coordinate
  const gradientY1 = Math.max(0, (pulseCenter - pulseHalf) / totalLength) * height
  const gradientY2 = Math.min(1, (pulseCenter + pulseHalf) / totalLength) * height
  const gradientMid = (gradientY1 + gradientY2) / 2

  return (
    <svg
      className="absolute left-8 md:left-1/2 md:-translate-x-[20px] top-0 pointer-events-none"
      width={40}
      height={height}
      viewBox={`0 0 40 ${height}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Pulse gradient - bright orange segment */}
        <linearGradient
          id="pulse-gradient"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={gradientY1}
          x2="0"
          y2={gradientY2}
        >
          <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
          <stop offset="30%" stopColor="#f97316" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#f97316" stopOpacity="1" />
          <stop offset="70%" stopColor="#f97316" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </linearGradient>

        {/* Glow filter for the pulse bloom */}
        <filter id="pulse-glow" x="-50%" y="-2%" width="200%" height="104%">
          <feGaussianBlur stdDeviation="6" />
        </filter>

        {/* Subtle glow for active dots */}
        <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* 1. Dormant line - always visible, very faint */}
      <path
        ref={pathRef}
        d={pathD}
        stroke={dormantColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
      />

      {/* 2. Activated trail - faint orange behind the pulse */}
      {totalLength > 0 && (
        <path
          d={pathD}
          stroke="#f97316"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeOpacity={0.2}
          fill="none"
          strokeDasharray={`${trailDash} ${trailGap}`}
          strokeDashoffset={0}
        />
      )}

      {/* 3. Glow bloom layer (blurred copy of pulse) */}
      {totalLength > 0 && (
        <path
          d={pathD}
          stroke="url(#pulse-gradient)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeOpacity={0.6}
          fill="none"
          filter="url(#pulse-glow)"
        />
      )}

      {/* 4. Sharp pulse layer */}
      {totalLength > 0 && (
        <path
          d={pathD}
          stroke="url(#pulse-gradient)"
          strokeWidth={2}
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* 5. Section dots */}
      {dotPositions.map((pos, i) => {
        const sectionId = sectionIds[i]
        const sectionT = sectionPositions[i] ?? 0
        const isActive =
          activeSections.has(sectionId) || scrollProgress >= sectionT

        return (
          <g key={sectionId ?? i}>
            {/* Glow ring for active dots */}
            {isActive && (
              <circle
                cx={pos.x}
                cy={pos.y}
                r={10}
                fill="#f97316"
                opacity={0.2}
                filter="url(#dot-glow)"
                style={{
                  transition: 'opacity 0.4s ease, r 0.4s ease',
                }}
              />
            )}
            {/* Dot */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r={isActive ? 6 : 4}
              fill={isActive ? '#f97316' : dormantColor}
              opacity={isActive ? 1 : 0.5}
              style={{
                transition: 'r 0.4s ease, fill 0.3s ease, opacity 0.3s ease',
              }}
            />
          </g>
        )
      })}
    </svg>
  )
}
