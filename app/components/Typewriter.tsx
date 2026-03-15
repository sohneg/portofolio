'use client'

import { useState, useEffect, useRef } from 'react'

interface TypewriterProps {
  text: string
  speed?: number       // base ms per character
  startDelay?: number  // ms before typing starts
  trigger?: boolean    // start typing when true
  natural?: boolean    // add random variation to speed
  className?: string
  onDone?: () => void
}

export default function Typewriter({
  text,
  speed = 30,
  startDelay = 0,
  trigger = true,
  natural = false,
  className,
  onDone,
}: TypewriterProps) {
  const [displayed, setDisplayed] = useState('')
  const [started, setStarted] = useState(false)
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!trigger || started) return

    const delayTimer = setTimeout(() => {
      setStarted(true)
    }, startDelay)

    return () => clearTimeout(delayTimer)
  }, [trigger, startDelay, started])

  useEffect(() => {
    if (!started) return

    indexRef.current = 0
    setDisplayed('')
    setDone(false)

    const typeNext = () => {
      indexRef.current++
      if (indexRef.current >= text.length) {
        setDisplayed(text)
        setDone(true)
        onDone?.()
        return
      }
      setDisplayed(text.slice(0, indexRef.current))

      // Natural typing: vary speed, pause longer on punctuation
      let nextDelay = speed
      if (natural) {
        const char = text[indexRef.current - 1]
        // Random variation ±40%
        nextDelay = speed * (0.6 + Math.random() * 0.8)
        // Pause longer after punctuation
        if (char === '.' || char === '!' || char === '?') {
          nextDelay += speed * 8
        } else if (char === ',' || char === ':' || char === ';') {
          nextDelay += speed * 3
        } else if (char === ' ') {
          // Occasional longer pause between words
          if (Math.random() < 0.15) {
            nextDelay += speed * 4
          }
        }
      }

      timerRef.current = setTimeout(typeNext, nextDelay)
    }

    timerRef.current = setTimeout(typeNext, speed)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [started, text, speed, natural, onDone])

  return (
    <span className={className}>
      {displayed}
      {started && !done && (
        <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
      )}
    </span>
  )
}
