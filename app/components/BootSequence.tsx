'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { VT323 } from 'next/font/google'

const bootFont = VT323({ weight: '400', subsets: ['latin'] })

const BOOT_LINES = [
  { text: 'BIOS v3.14 - Simon Sohneg Systems', delay: 0, type: 'header' },
  { text: '', delay: 200, type: 'blank' },
  { text: 'Running memory check...            [ 32GB OK ]', delay: 300, type: 'line' },
  { text: 'Detecting career modules...', delay: 500, type: 'line' },
  { text: '  /dev/baker ...................... [ REMOVED ]', delay: 800, type: 'error' },
  { text: '  /dev/flour ...................... [ ALLERGY ]', delay: 1000, type: 'error' },
  { text: '  /dev/future .................... [ FOUND   ]', delay: 1300, type: 'success' },
  { text: '', delay: 1500, type: 'blank' },
  { text: 'Loading new career path...', delay: 1600, type: 'line' },
  { text: '  Installing typescript@5.x .....  [  OK  ]', delay: 1900, type: 'success' },
  { text: '  Installing react@19 ...........  [  OK  ]', delay: 2100, type: 'success' },
  { text: '  Installing nextjs@16 ..........  [  OK  ]', delay: 2300, type: 'success' },
  { text: '  Installing csharp-runtime .....  [  OK  ]', delay: 2500, type: 'success' },
  { text: '  Installing unity-engine .......  [  OK  ]', delay: 2700, type: 'success' },
  { text: '  Installing docker .............  [  OK  ]', delay: 2900, type: 'success' },
  { text: '  Installing claude-code ........  [  OK  ]', delay: 3100, type: 'success' },
  { text: '', delay: 3300, type: 'blank' },
  { text: 'Mounting /home/simon ...............  [  OK  ]', delay: 3400, type: 'success' },
  { text: 'Starting network services ..........  [  OK  ]', delay: 3600, type: 'success' },
  { text: 'Loading passion.service ............  [  OK  ]', delay: 3800, type: 'success' },
  { text: '', delay: 4000, type: 'blank' },
  { text: 'All systems operational.', delay: 4100, type: 'line' },
  { text: 'Starting terminal...', delay: 4400, type: 'header' },
]

const GLITCH_DURATION = 1500
const FADE_DURATION = 500
const BOOT_DURATION = 4800
const FADE_OUT_DURATION = 800

type Phase = 'idle' | 'glitch' | 'black' | 'boot' | 'fadeout' | 'done'

interface BootSequenceProps {
  /** Called when boot sequence should start (user scrolled past wendepunkt) */
  active: boolean
  /** Called when boot is completely done */
  onDone?: () => void
}

export default function BootSequence({ active, onDone }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [bootTime, setBootTime] = useState(0)
  const [glitchTick, setGlitchTick] = useState(0)
  const rafRef = useRef<number>(0)
  const startRef = useRef<number>(0)

  // Start sequence when active
  useEffect(() => {
    if (active && phase === 'idle') {
      setPhase('glitch')
      startRef.current = performance.now()
    }
    if (!active && phase !== 'idle') {
      // Reset
      setPhase('idle')
      setBootTime(0)
      setGlitchTick(0)
    }
  }, [active, phase])

  // Animate through phases
  useEffect(() => {
    if (phase === 'idle' || phase === 'done') return

    const animate = (now: number) => {
      const elapsed = now - startRef.current

      if (phase === 'glitch') {
        setGlitchTick(now) // force re-render for random glitch
        if (elapsed >= GLITCH_DURATION) {
          setPhase('black')
          startRef.current = now
        }
      } else if (phase === 'black') {
        if (elapsed >= FADE_DURATION) {
          setPhase('boot')
          startRef.current = now
        }
      } else if (phase === 'boot') {
        setBootTime(elapsed)
        if (elapsed >= BOOT_DURATION) {
          setPhase('fadeout')
          startRef.current = now
        }
      } else if (phase === 'fadeout') {
        if (elapsed >= FADE_OUT_DURATION) {
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

  const glitchAmount = phase === 'glitch' ? 0.3 + Math.sin(glitchTick * 0.01) * 0.3 : 0
  const blackOpacity = phase === 'glitch' ? 0
    : phase === 'black' ? 1
    : phase === 'boot' ? 1
    : phase === 'fadeout' ? 1 : 0
  const fadeOutOpacity = phase === 'fadeout'
    ? Math.max(0, 1 - (performance.now() - startRef.current) / FADE_OUT_DURATION)
    : 1

  return (
    <div
      className="fixed inset-0 z-[40] pointer-events-none"
      style={{ opacity: fadeOutOpacity }}
    >
      {/* Glitch overlay */}
      {phase === 'glitch' && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent ${2 + Math.random() * 3}px,
              rgba(255,255,255,${glitchAmount * 0.15}) ${2 + Math.random() * 3}px,
              rgba(255,255,255,${glitchAmount * 0.15}) ${3 + Math.random() * 4}px
            )`,
            transform: `translateX(${(Math.random() - 0.5) * glitchAmount * 20}px) skewX(${(Math.random() - 0.5) * glitchAmount * 3}deg)`,
            mixBlendMode: 'overlay',
          }}
        />
      )}

      {/* Horizontal glitch bars */}
      {phase === 'glitch' && (
        <>
          <div
            className="absolute left-0 right-0 bg-cyan-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              height: `${2 + Math.random() * 8}px`,
              transform: `translateX(${(Math.random() - 0.5) * 30}px)`,
            }}
          />
          <div
            className="absolute left-0 right-0 bg-red-500/10"
            style={{
              top: `${Math.random() * 100}%`,
              height: `${2 + Math.random() * 5}px`,
              transform: `translateX(${(Math.random() - 0.5) * 20}px)`,
            }}
          />
        </>
      )}

      {/* Black screen */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          opacity: blackOpacity,
          transition: phase === 'black' ? `opacity ${FADE_DURATION}ms ease` : 'none',
        }}
      />

      {/* Boot text */}
      {(phase === 'boot' || phase === 'fadeout') && (
        <div className={`absolute inset-0 flex items-start justify-start p-10 pt-16 md:p-20 overflow-hidden ${bootFont.className}`}>
          <div className="text-sm md:text-base leading-relaxed">
            {BOOT_LINES.map((line, i) => {
              if (bootTime < line.delay) return null

              let color = 'text-gray-300'
              if (line.type === 'header') color = 'text-white font-bold'
              if (line.type === 'success') color = 'text-green-400'
              if (line.type === 'error') color = 'text-red-400'

              return (
                <div key={i} className={color} style={{ whiteSpace: 'pre' }}>
                  {line.text || '\u00A0'}
                </div>
              )
            })}

            {phase === 'boot' && (
              <span className="text-green-400" style={{ animation: 'blink 1s step-end infinite' }}>_</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
