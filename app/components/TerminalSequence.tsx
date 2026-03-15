'use client'

import { useState, useEffect, useRef } from 'react'
import InteractivePrompt from './InteractivePrompt'

interface TerminalSequenceProps {
  loginText: string
  command: string
  output: string
  trigger: boolean
}

/**
 * Simulates a realistic terminal session:
 * 1. Login line types in fast
 * 2. Prompt appears, command types in naturally
 * 3. After "enter" delay, output appears instantly
 * 4. New prompt with blinking cursor
 */
export default function TerminalSequence({ loginText, command, output, trigger }: TerminalSequenceProps) {
  const [phase, setPhase] = useState<'idle' | 'login' | 'prompt' | 'typing' | 'processing' | 'output' | 'done'>('idle')
  const [loginDisplayed, setLoginDisplayed] = useState('')
  const [cmdDisplayed, setCmdDisplayed] = useState('')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const indexRef = useRef(0)

  // Start when triggered
  useEffect(() => {
    if (!trigger || phase !== 'idle') return
    setPhase('login')
  }, [trigger, phase])

  // Phase: login line appears instantly
  useEffect(() => {
    if (phase !== 'login') return
    setLoginDisplayed(loginText)
    timerRef.current = setTimeout(() => setPhase('prompt'), 300)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, loginText])

  // Phase: show prompt, then start typing command
  useEffect(() => {
    if (phase !== 'prompt') return
    timerRef.current = setTimeout(() => setPhase('typing'), 400)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase])

  // Phase: type command naturally
  useEffect(() => {
    if (phase !== 'typing') return
    indexRef.current = 0
    setCmdDisplayed('')

    const typeNext = () => {
      indexRef.current++
      if (indexRef.current >= command.length) {
        setCmdDisplayed(command)
        // Simulate pressing Enter - delay before output
        timerRef.current = setTimeout(() => setPhase('processing'), 1500)
        return
      }
      setCmdDisplayed(command.slice(0, indexRef.current))

      // Natural typing speed
      const char = command[indexRef.current - 1]
      let delay = 60 * (0.5 + Math.random() * 1.0)
      if (char === ' ') delay += Math.random() < 0.3 ? 120 : 0
      if (char === '/' || char === '.') delay += 40

      timerRef.current = setTimeout(typeNext, delay)
    }
    timerRef.current = setTimeout(typeNext, 60)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase, command])

  // Phase: processing → done (output + final prompt appear)
  useEffect(() => {
    if (phase !== 'processing') return
    timerRef.current = setTimeout(() => setPhase('done'), 200)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [phase])

  const [cleared, setCleared] = useState(false)

  const showLogin = phase !== 'idle' && !cleared
  const showPrompt = (phase === 'prompt' || phase === 'typing' || phase === 'processing' || phase === 'done') && !cleared
  const showCursor = phase === 'typing'
  const showOutput = phase === 'done' && !cleared
  const showFinalPrompt = phase === 'done'

  return (
    <div>
      {/* Last login */}
      {showLogin && (
        <div className="text-gray-500">
          {loginDisplayed}
        </div>
      )}

      {/* Command line */}
      {showPrompt && (
        <div className="text-green-400">
          <span className="text-green-600" style={{ whiteSpace: 'pre' }}>{'root@sohneg.ch:~#  '}</span>
          {cmdDisplayed}
          {showCursor && (
            <span style={{ animation: 'blink 1s step-end infinite' }}>|</span>
          )}
        </div>
      )}

      {/* Output - appears instantly */}
      {showOutput && (
        <div className="text-green-400/80">
          {output}
        </div>
      )}

      {/* Interactive prompt after animation */}
      {showFinalPrompt && (
        <InteractivePrompt onClear={() => setCleared(true)} />
      )}
    </div>
  )
}
