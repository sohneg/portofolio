'use client'

import { useEffect, useRef, useState } from 'react'

interface WheelWipeProps {
  active: boolean
  onDone?: () => void
}

const ROLL_DURATION = 1500
const FADE_DURATION = 500

type Phase = 'idle' | 'rolling' | 'fadeout' | 'done'

/**
 * A tire rolls from right to left across the screen as a wipe transition.
 */
export default function WheelWipe({ active, onDone }: WheelWipeProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [wheelX, setWheelX] = useState(110) // percentage from left
  const [wheelRotation, setWheelRotation] = useState(0)
  const [wipeProgress, setWipeProgress] = useState(0)
  const startRef = useRef(0)
  const rafRef = useRef(0)
  const [wheelSrc, setWheelSrc] = useState<string | null>(null)

  // Check for wheel image
  useEffect(() => {
    const img = new Image()
    img.onload = () => setWheelSrc('/wheel.png')
    img.onerror = () => setWheelSrc(null)
    img.src = '/wheel.png'
  }, [])

  useEffect(() => {
    if (active && phase === 'idle') {
      setPhase('rolling')
      startRef.current = performance.now()
      // Scroll to tuning section in background
      setTimeout(() => {
        const el = document.getElementById('tuning')
        if (el) {
          const isMobile = window.innerWidth < 768
          const target = isMobile ? el.offsetTop : el.offsetTop - (window.innerHeight - el.offsetHeight) / 2
          window.scrollTo({ top: target, behavior: 'smooth' })
        }
      }, ROLL_DURATION * 0.5)
    }
    if (!active && phase !== 'idle') {
      setPhase('idle')
      setWheelX(110)
      setWheelRotation(0)
      setWipeProgress(0)
    }
  }, [active, phase])

  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return

    const animate = (now: number) => {
      const elapsed = now - startRef.current

      if (phase === 'rolling') {
        const t = Math.min(1, elapsed / ROLL_DURATION)
        // Wheel rolls from right (110%) to left (-20%)
        setWheelX(110 - t * 130)
        // Rotate: full rotations as it rolls
        setWheelRotation(t * -720)
        // Wipe follows the wheel
        setWipeProgress(t)

        if (t >= 1) {
          setPhase('fadeout')
          startRef.current = now
        }
      } else if (phase === 'fadeout') {
        if (elapsed >= FADE_DURATION) {
          setPhase('done')
          onDone?.()
          return
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [phase, onDone])

  if (phase === 'idle' || phase === 'done') return null

  const fadeOutOpacity = phase === 'fadeout'
    ? Math.max(0, 1 - (performance.now() - startRef.current) / FADE_DURATION)
    : 1

  return (
    <div
      className="fixed inset-0 z-[40] pointer-events-none"
      style={{ opacity: fadeOutOpacity }}
    >
      {/* Wipe overlay - follows behind the wheel */}
      <div
        className="absolute inset-0 bg-background"
        style={{
          clipPath: `inset(0 ${Math.max(0, (1 - wipeProgress) * 100)}% 0 0)`,
        }}
      />

      {/* Wheel - massive, covers entire viewport height */}
      <div
        className="absolute top-1/2"
        style={{
          left: `${wheelX}%`,
          transform: `translateX(-50%) translateY(-50%) rotate(${wheelRotation}deg)`,
          width: '200vh',
          height: '200vh',
        }}
      >
        {wheelSrc ? (
          <img src={wheelSrc} alt="" className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full rounded-full border-[16px] border-current opacity-30 flex items-center justify-center">
            <div className="w-1/3 h-1/3 rounded-full border-8 border-current opacity-50" />
          </div>
        )}
      </div>
    </div>
  )
}
