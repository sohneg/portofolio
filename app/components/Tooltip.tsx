'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface TooltipProps {
  children: React.ReactNode
  text: string
}

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'

export default function Tooltip({ children, text }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [displayText, setDisplayText] = useState(text)
  const lockedCharsRef = useRef(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lockIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startAnimation = useCallback(() => {
    lockedCharsRef.current = 0

    // Scramble effect - runs fast
    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, i) => {
            if (i < lockedCharsRef.current) return text[i]
            if (char === ' ') return ' '
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      )
    }, 30)

    // Lock in characters from left to right
    lockIntervalRef.current = setInterval(() => {
      lockedCharsRef.current += 1
      if (lockedCharsRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (lockIntervalRef.current) clearInterval(lockIntervalRef.current)
        setDisplayText(text)
      }
    }, 50)
  }, [text])

  const stopAnimation = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (lockIntervalRef.current) clearInterval(lockIntervalRef.current)
    setDisplayText(text)
    lockedCharsRef.current = 0
  }, [text])

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
        {displayText}
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-nav" />
      </div>
    </div>
  )
}
