'use client'

import { useEffect, useRef, useState } from 'react'

interface TachoTransitionProps {
  visible: boolean
  /** Called once when the needle finishes its rev to the maximum. */
  onComplete?: () => void
}

export default function TachoTransition({ visible, onComplete }: TachoTransitionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  // Needle revs from 0 → max once the gauge is centred in the viewport.
  const [progress, setProgress] = useState(0)
  // Self-managed visibility so the gauge shows even when reloaded directly on it.
  const [inView, setInView] = useState(false)
  const rafRef = useRef(0)
  const startedRef = useRef(false)
  // Keep latest callback without re-running the observer effect.
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const DURATION = 1800
    const startRev = () => {
      if (startedRef.current) return
      startedRef.current = true
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / DURATION)
        const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic: fast rev, gentle settle
        setProgress(eased)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick)
        } else {
          onCompleteRef.current?.()
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setInView(true)
          if (entry.intersectionRatio >= 0.6) startRev()
        })
      },
      { threshold: [0, 0.6] }
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const count = Math.round(progress * 9000)
  const showCount = progress > 0.6

  // 180° sweep over the top: progress 0 → points left, 1 → points right (never droops below the arc)
  const needleRad = (180 + progress * 180) * (Math.PI / 180)
  const r = (n: number) => Math.round(n * 100) / 100
  const nx = r(50 + 38 * Math.cos(needleRad))
  const ny = r(52 + 38 * Math.sin(needleRad))

  return (
    <div
      id="tacho"
      ref={rootRef}
      className={`min-h-screen flex items-center justify-center z-[2] transition-all duration-1000
      ${visible || inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
    >
      <div className="flex flex-col items-center">
        {/* Tachometer */}
        <svg viewBox="0 0 100 60" className="w-72 h-44 md:w-[28rem] md:h-[17rem]">
          {/* Glow behind the arc */}
          <defs>
            <filter id="tacho-glow">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
            <linearGradient id="arc-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="30%" stopColor="#84cc16" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#f97316" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Background arc glow */}
          <path
            d="M 8 52 A 42 42 0 0 1 92 52"
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.15"
            filter="url(#tacho-glow)"
          />

          {/* Main arc */}
          <path
            d="M 8 52 A 42 42 0 0 1 92 52"
            fill="none"
            stroke="url(#arc-gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.8"
          />

          {/* Tick marks */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val) => {
            const rad = (180 + (val / 9) * 180) * (Math.PI / 180)
            const cos = Math.cos(rad)
            const sin = Math.sin(rad)
            const r = (n: number) => Math.round(n * 100) / 100
            return (
              <g key={val}>
                <line
                  x1={r(50 + 36 * cos)} y1={r(52 + 36 * sin)}
                  x2={r(50 + 42 * cos)} y2={r(52 + 42 * sin)}
                  stroke="white" strokeWidth="0.8" opacity="0.5"
                />
                <text
                  x={r(50 + 31 * cos)} y={r(52 + 31 * sin)}
                  textAnchor="middle" dominantBaseline="central"
                  fill="white" fontSize="3.5" opacity="0.4"
                >
                  {val}
                </text>
              </g>
            )
          })}

          {/* Needle shadow */}
          <line
            x1="50" y1="52"
            x2={nx}
            y2={ny}
            stroke="rgba(249,115,22,0.3)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#tacho-glow)"
          />

          {/* Needle */}
          <line
            x1="50" y1="52"
            x2={nx}
            y2={ny}
            stroke="#f97316"
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Center hub */}
          <circle cx="50" cy="52" r="2.5" fill="#f97316" opacity="0.9" />
          <circle cx="50" cy="52" r="1.5" fill="#1a1a1a" />
        </svg>

        {/* Counter */}
        <div className={`text-5xl md:text-7xl font-bold text-orange-500 mt-4 transition-all duration-500
          ${showCount ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          {count.toLocaleString()}+
        </div>
        <div className={`text-sm md:text-lg opacity-50 mt-1 transition-opacity duration-500
          ${showCount ? 'opacity-50' : 'opacity-0'}`}
        >
          Mitglieder
        </div>
      </div>
    </div>
  )
}
