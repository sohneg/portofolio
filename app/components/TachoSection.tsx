'use client'

import { useEffect, useRef, useState } from 'react'

interface TachoSectionProps {
  title: string
  text: string
  visible: boolean
}

/**
 * Tuning Schweiz section with:
 * 1. Tire rolling in from right (wipe transition)
 * 2. Tachometer with needle pointing to 9000
 * 3. Counter animating up to 9000+
 * 4. Text appearing after
 */
export default function TachoSection({ title, text, visible }: TachoSectionProps) {
  const [count, setCount] = useState(0)
  const [countDone, setCountDone] = useState(false)
  const countStarted = useRef(false)

  // Animate counter when visible
  useEffect(() => {
    if (!visible || countStarted.current) return
    countStarted.current = true

    const target = 9000
    const duration = 2000
    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * target))
      if (t < 1) {
        requestAnimationFrame(animate)
      } else {
        setCountDone(true)
      }
    }
    requestAnimationFrame(animate)
  }, [visible])

  // Needle rotation: 0 = -130deg (left), 9000 = 130deg (right)
  const needleRotation = -130 + (count / 9000) * 260

  return (
    <div className={`max-w-2xl mx-auto text-center transition-all duration-1000 ease-out
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
    >
      {/* Tachometer */}
      <div className="relative w-48 h-24 md:w-64 md:h-32 mx-auto mb-6">
        {/* Tacho background arc */}
        <svg viewBox="0 0 200 110" className="w-full h-full">
          {/* Outer arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.2"
          />
          {/* Colored segments */}
          <path
            d="M 20 100 A 80 80 0 0 1 60 30"
            fill="none"
            stroke="#22c55e"
            strokeWidth="4"
            opacity="0.6"
          />
          <path
            d="M 60 30 A 80 80 0 0 1 140 30"
            fill="none"
            stroke="#eab308"
            strokeWidth="4"
            opacity="0.6"
          />
          <path
            d="M 140 30 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            opacity="0.8"
          />

          {/* Tick marks */}
          {[0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000].map((val, i) => {
            const angle = (-130 + (val / 9000) * 260) * (Math.PI / 180)
            const cx = 100, cy = 100, r1 = 72, r2 = 80
            const round = (n: number) => Math.round(n * 100) / 100
            return (
              <line
                key={val}
                x1={round(cx + r1 * Math.cos(angle - Math.PI / 2))}
                y1={round(cy + r1 * Math.sin(angle - Math.PI / 2))}
                x2={round(cx + r2 * Math.cos(angle - Math.PI / 2))}
                y2={round(cy + r2 * Math.sin(angle - Math.PI / 2))}
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.4"
              />
            )
          })}

          {/* Needle */}
          <line
            x1="100"
            y1="100"
            x2={Math.round((100 + 65 * Math.cos((needleRotation - 90) * (Math.PI / 180))) * 100) / 100}
            y2={Math.round((100 + 65 * Math.sin((needleRotation - 90) * (Math.PI / 180))) * 100) / 100}
            stroke="#f97316"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Center dot */}
          <circle cx="100" cy="100" r="4" fill="#f97316" />
        </svg>
      </div>

      {/* Counter */}
      <div className={`text-4xl md:text-6xl font-bold mb-2 transition-all duration-500
        ${countDone ? 'text-orange-500' : ''}`}
      >
        {count.toLocaleString()}+
      </div>
      <div className={`text-sm md:text-base opacity-50 mb-8 transition-opacity duration-500
        ${countDone ? 'opacity-50' : 'opacity-0'}`}
      >
        Mitglieder
      </div>

      {/* Title */}
      <h2 className={`text-2xl md:text-5xl font-bold mb-4 md:mb-6 transition-all duration-700
        ${countDone ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        {title}
      </h2>

      {/* Text */}
      <p className={`text-sm md:text-xl leading-relaxed opacity-80 transition-all duration-700
        ${countDone ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '200ms' }}
      >
        {text}
      </p>
    </div>
  )
}
