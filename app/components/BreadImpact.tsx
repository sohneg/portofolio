'use client'

import { useEffect, useRef, useState, useMemo } from 'react'

interface BreadImpactProps {
  title: string
  text: string
  icon?: React.ReactNode
}

interface CharData {
  char: string
  // Scatter direction (random per char)
  dx: number
  dy: number
  rotation: number
}

function generateCharData(str: string): CharData[] {
  return str.split('').map((char) => ({
    char,
    dx: (Math.random() - 0.5) * 800,
    dy: (Math.random() - 0.5) * 600,
    rotation: (Math.random() - 0.5) * 720,
  }))
}

export default function BreadImpact({ title, text, icon }: BreadImpactProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  const titleChars = useMemo(() => generateCharData(title), [title])
  const textChars = useMemo(() => generateCharData(text), [text])

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const scrollable = el.offsetHeight - window.innerHeight
      if (scrollable <= 0) return
      const p = Math.max(0, Math.min(1, -rect.top / scrollable))
      setProgress(p)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Phases:
  // 0.0 - 0.15: text fully visible (seamless from KeywordZoom)
  // 0.15 - 0.4: bread flies in from left
  // 0.4 - 0.45: impact shake
  // 0.45 - 0.9: letters scatter outward, everything fades
  // 0.9 - 1.0: fully gone

  const breadX = progress < 0.15
    ? -120
    : progress < 0.4
      ? -120 + ((progress - 0.15) / 0.25) * 170
      : 50

  const breadScale = progress < 0.15
    ? 1
    : progress < 0.4
      ? 1 + ((progress - 0.15) / 0.25) * 0.3
      : progress < 0.45
        ? 1.3 - ((progress - 0.4) / 0.05) * 0.3
        : 1

  const breadRotation = progress < 0.15
    ? 0
    : progress < 0.4
      ? ((progress - 0.15) / 0.25) * -15
      : -15

  // Impact shake
  const shakeX = progress >= 0.4 && progress < 0.45
    ? Math.sin(progress * 200) * 10 * (1 - (progress - 0.4) / 0.05)
    : 0
  const shakeY = progress >= 0.4 && progress < 0.45
    ? Math.cos(progress * 200) * 6 * (1 - (progress - 0.4) / 0.05)
    : 0

  // Scatter amount (0 = together, 1 = fully scattered)
  const scatter = progress < 0.4
    ? 0
    : Math.min(1, (progress - 0.4) / 0.45)

  // Fade out everything
  const fadeOut = progress < 0.5
    ? 1
    : Math.max(0, 1 - (progress - 0.5) / 0.4)

  // Crumbs particles
  const crumbs = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      dx: (Math.random() - 0.5) * 400,
      dy: (Math.random() - 0.3) * 300,
      size: 3 + Math.random() * 6,
      rotation: Math.random() * 360,
    })), [])

  const crumbProgress = progress < 0.4 ? 0 : Math.min(1, (progress - 0.4) / 0.3)

  return (
    <div ref={containerRef} style={{ height: '250vh' }}>
      <div
        className="sticky top-0 h-screen flex items-center justify-center overflow-hidden z-[2]"
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px)`,
        }}
      >
        {/* Bread projectile */}
        <div
          className="absolute text-7xl md:text-9xl select-none"
          style={{
            left: `${breadX}%`,
            top: '50%',
            transform: `translate(-50%, -50%) scale(${breadScale}) rotate(${breadRotation}deg)`,
            opacity: progress < 0.1 ? 0 : progress < 0.15 ? (progress - 0.1) / 0.05 : fadeOut,
            transition: 'none',
            zIndex: 10,
          }}
        >
          🍞
        </div>

        {/* Crumbs on impact */}
        {crumbProgress > 0 && crumbs.map((crumb, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: '50%',
              top: '50%',
              width: crumb.size,
              height: crumb.size,
              backgroundColor: '#d4a574',
              transform: `translate(${crumb.dx * crumbProgress}px, ${crumb.dy * crumbProgress}px) rotate(${crumb.rotation * crumbProgress}deg)`,
              opacity: Math.max(0, 1 - crumbProgress * 1.5),
            }}
          />
        ))}

        {/* Content that gets shattered */}
        <div className="max-w-2xl mx-auto text-center px-8 md:pl-24" style={{ opacity: fadeOut }}>
          {/* Icon */}
          {icon && (
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8"
              style={{
                transform: scatter > 0 ? `translate(${-200 * scatter}px, ${-150 * scatter}px) rotate(${-90 * scatter}deg)` : 'none',
                opacity: 1 - scatter,
              }}
            >
              {icon}
            </div>
          )}

          {/* Title - each char scatters */}
          <h2 className="text-3xl md:text-5xl font-bold font-serif mb-6">
            {titleChars.map((c, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  transform: scatter > 0
                    ? `translate(${c.dx * scatter}px, ${c.dy * scatter}px) rotate(${c.rotation * scatter}deg)`
                    : 'none',
                  opacity: 1 - scatter * 0.8,
                }}
              >
                {c.char === ' ' ? '\u00A0' : c.char}
              </span>
            ))}
          </h2>

          {/* Text - each char scatters */}
          <p className="text-lg md:text-xl leading-relaxed opacity-80">
            {textChars.map((c, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  transform: scatter > 0
                    ? `translate(${c.dx * scatter}px, ${c.dy * scatter}px) rotate(${c.rotation * scatter}deg)`
                    : 'none',
                  opacity: 1 - scatter * 0.8,
                }}
              >
                {c.char === ' ' ? '\u00A0' : c.char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  )
}
