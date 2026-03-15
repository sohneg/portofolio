'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TooltipProps {
  children: React.ReactNode
  text: string
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'

const RAINBOW_COLORS = [
  '#e06060', '#e09a60', '#ccc060', '#60cc85',
  '#60b8cc', '#6080e0', '#a060cc',
]

type CharPhase = 'scrambling' | 'fading' | 'done'

interface CharState {
  char: string
  phase: CharPhase
}

export default function Tooltip({ children, text }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [charStates, setCharStates] = useState<CharState[]>(
    () => text.split('').map(c => ({ char: c, phase: 'done' as CharPhase }))
  )
  const lockedCharsRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lockIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const fadeTimersRef = useRef<NodeJS.Timeout[]>([])

  const clearAllTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (lockIntervalRef.current) clearInterval(lockIntervalRef.current)
    fadeTimersRef.current.forEach(t => clearTimeout(t))
    fadeTimersRef.current = []
  }, [])

  const startAnimation = useCallback(() => {
    lockedCharsRef.current = 0

    // Scramble effect
    intervalRef.current = setInterval(() => {
      setCharStates(prev =>
        text.split('').map((char, i) => {
          if (i < lockedCharsRef.current) return prev[i] // keep fading/done state
          if (char === ' ') return { char: ' ', phase: 'done' as CharPhase }
          return { char: chars[Math.floor(Math.random() * chars.length)], phase: 'scrambling' as CharPhase }
        })
      )
    }, 20)

    // Lock characters one by one
    lockIntervalRef.current = setInterval(() => {
      const idx = lockedCharsRef.current
      lockedCharsRef.current += 1

      // Set this char to 'fading' (keeps rainbow color, correct char)
      setCharStates(prev =>
        prev.map((cs, i) => i === idx ? { char: text[idx], phase: 'fading' } : cs)
      )

      // After delay, transition to 'done' (removes rainbow color with CSS transition)
      const fadeTimer = setTimeout(() => {
        setCharStates(prev =>
          prev.map((cs, i) => i === idx && cs.phase === 'fading' ? { ...cs, phase: 'done' } : cs)
        )
      }, 80)
      fadeTimersRef.current.push(fadeTimer)

      if (lockedCharsRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (lockIntervalRef.current) clearInterval(lockIntervalRef.current)
      }
    }, 70)
  }, [text])

  const stopAnimation = useCallback(() => {
    clearAllTimers()
    setCharStates(text.split('').map(c => ({ char: c, phase: 'done' })))
    lockedCharsRef.current = 0
  }, [text, clearAllTimers])

  useEffect(() => {
    if (isVisible) {
      startAnimation()
    } else {
      stopAnimation()
    }

    return stopAnimation
  }, [isVisible, startAnimation, stopAnimation])

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 z-50
          bg-nav text-foreground text-sm rounded-lg whitespace-nowrap font-mono
          transition-opacity duration-200 pointer-events-none
          ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        {charStates.map((cs, i) => (
          <span
            key={i}
            style={{
              color: cs.phase === 'done' ? undefined : RAINBOW_COLORS[i % RAINBOW_COLORS.length],
              transition: cs.phase === 'done' ? 'color 0.2s ease' : 'none',
            }}
          >
            {cs.char}
          </span>
        ))}
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-nav" />
      </div>
    </div>
  )
}
