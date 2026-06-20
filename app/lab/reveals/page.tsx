'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { FaGooglePlay, FaGlobe } from 'react-icons/fa6'

/**
 * Throwaway comparison lab for project-description reveal animations.
 * Hover a card (desktop) or tap the title (mobile) to reveal the description.
 * Stack + links stay visible at all times.
 */

const SAMPLE = {
  title: 'PillPal: Pill & Med Reminder',
  description:
    'A medication reminder app for Android with alarm-style notifications, custom voice reminders, a health journal for blood pressure and blood sugar, multiple family profiles, and PDF/CSV export for doctors. Works fully offline.',
  tech: ['Kotlin', 'Android', 'Jetpack', 'SQLite'],
  links: [
    { icon: <FaGooglePlay />, label: 'Google Play' },
    { icon: <FaGlobe />, label: 'Website' },
  ],
}

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*'

/* ---------- shared collapse (height) wrapper ---------- */
function Collapse({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-300 ease-out"
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
    >
      <div className="overflow-hidden min-h-0">{children}</div>
    </div>
  )
}

/* ---------- effect: slide + fade ---------- */
function SlideText({ text, open }: { text: string; open: boolean }) {
  return (
    <p
      className="transition-all duration-300 ease-out"
      style={{ opacity: open ? 1 : 0, transform: open ? 'translateY(0)' : 'translateY(8px)' }}
    >
      {text}
    </p>
  )
}

/* ---------- effect: paper unfold (3D rotateX) ---------- */
function UnfoldText({ text, open }: { text: string; open: boolean }) {
  return (
    <div style={{ perspective: '900px' }}>
      <p
        className="origin-top"
        style={{
          transform: open ? 'rotateX(0deg)' : 'rotateX(-92deg)',
          opacity: open ? 1 : 0,
          transformOrigin: 'top center',
          transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease-out 0.12s',
          boxShadow: open ? '0 8px 18px -10px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        {text}
      </p>
    </div>
  )
}

/* ---------- effect: scramble / decode ---------- */
function ScrambleText({ text, open }: { text: string; open: boolean }) {
  const [display, setDisplay] = useState('')
  const rafRef = useRef(0)

  useEffect(() => {
    if (!open) {
      setDisplay('')
      return
    }
    let start = 0
    const DURATION = 750
    const animate = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / DURATION)
      const revealCount = Math.floor(t * text.length)
      let out = ''
      for (let i = 0; i < text.length; i++) {
        if (i < revealCount || text[i] === ' ') out += text[i]
        else out += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      }
      setDisplay(out)
      if (t < 1) rafRef.current = requestAnimationFrame(animate)
      else setDisplay(text)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [open, text])

  return <p className="font-mono text-sm">{display}</p>
}

/* ---------- effect: dissolve / grain (feTurbulence displacement) ---------- */
function DissolveText({ text, open }: { text: string; open: boolean }) {
  const [scale, setScale] = useState(0)
  const [opacity, setOpacity] = useState(0)
  const rafRef = useRef(0)
  const filterId = useId().replace(/:/g, '')

  useEffect(() => {
    if (!open) {
      setScale(0)
      setOpacity(0)
      return
    }
    let start = 0
    const DURATION = 650
    const animate = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / DURATION)
      const eased = 1 - Math.pow(1 - t, 2)
      setScale((1 - eased) * 26)
      setOpacity(eased)
      if (t < 1) rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [open])

  return (
    <div style={{ opacity, filter: `url(#${filterId})` }}>
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <filter id={filterId}>
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} />
        </filter>
      </svg>
      <p>{text}</p>
    </div>
  )
}

/* ---------- effect: redacted → reveal (black bars lift) ---------- */
function RedactedText({ text, open }: { text: string; open: boolean }) {
  const words = text.split(' ')
  return (
    <p className="leading-relaxed">
      {words.map((w, i) => (
        <span key={i}>
          <span
            className="transition-all duration-500 rounded-[3px] px-0.5"
            style={{
              backgroundColor: open ? 'transparent' : 'var(--foreground)',
              color: open ? 'var(--text-secondary)' : 'transparent',
              transitionDelay: `${Math.min(i * 18, 400)}ms`,
            }}
          >
            {w}
          </span>{' '}
        </span>
      ))}
    </p>
  )
}

/* ---------- effect: blur → focus ---------- */
function BlurText({ text, open }: { text: string; open: boolean }) {
  return (
    <p
      className="transition-all duration-500 ease-out"
      style={{ opacity: open ? 1 : 0, filter: open ? 'blur(0px)' : 'blur(7px)' }}
    >
      {text}
    </p>
  )
}

/* ---------- effect: typewriter / ink ---------- */
function TypewriterText({ text, open }: { text: string; open: boolean }) {
  const [count, setCount] = useState(0)
  const rafRef = useRef(0)
  useEffect(() => {
    if (!open) {
      setCount(0)
      return
    }
    let start = 0
    const DURATION = 950
    const animate = (now: number) => {
      if (!start) start = now
      const t = Math.min(1, (now - start) / DURATION)
      setCount(Math.floor(t * text.length))
      if (t < 1) rafRef.current = requestAnimationFrame(animate)
      else setCount(text.length)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [open, text])
  return (
    <p>
      {text.slice(0, count)}
      <span
        className="inline-block w-[2px] h-[1em] align-text-bottom bg-orange-500 ml-0.5 animate-pulse"
        style={{ opacity: open && count < text.length ? 1 : 0 }}
      />
    </p>
  )
}

/* ---------- effect: word stagger up ---------- */
function WordStaggerText({ text, open }: { text: string; open: boolean }) {
  const words = text.split(' ')
  return (
    <p>
      {words.map((w, i) => (
        <span
          key={i}
          className="inline-block transition-all duration-300 ease-out"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'translateY(0)' : 'translateY(8px)',
            transitionDelay: `${Math.min(i * 22, 500)}ms`,
          }}
        >
          {w}&nbsp;
        </span>
      ))}
    </p>
  )
}

/* ---------- effect: wipe / curtain (clip-path L→R) ---------- */
function WipeText({ text, open }: { text: string; open: boolean }) {
  const clip = open ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)'
  return (
    <p
      className="transition-[clip-path] duration-500 ease-out"
      style={{ clipPath: clip, WebkitClipPath: clip }}
    >
      {text}
    </p>
  )
}

/* ---------- effect: highlighter sweep ---------- */
function HighlighterText({ text, open }: { text: string; open: boolean }) {
  return (
    <div className="relative">
      <div
        className="absolute inset-0 bg-orange-500/25 origin-left transition-transform duration-300 ease-out rounded-sm"
        style={{ transform: open ? 'scaleX(1)' : 'scaleX(0)' }}
      />
      <p
        className="relative transition-opacity duration-300"
        style={{ opacity: open ? 1 : 0, transitionDelay: open ? '180ms' : '0ms' }}
      >
        {text}
      </p>
    </div>
  )
}

/* ---------- effect: spotlight expand (clip circle) ---------- */
function SpotlightText({ text, open }: { text: string; open: boolean }) {
  const clip = open ? 'circle(140% at 0% 0%)' : 'circle(0% at 0% 0%)'
  return (
    <p
      className="transition-[clip-path] duration-500 ease-out"
      style={{ clipPath: clip, WebkitClipPath: clip }}
    >
      {text}
    </p>
  )
}

/* ---------- effect: letter spread ---------- */
function LetterSpreadText({ text, open }: { text: string; open: boolean }) {
  return (
    <p
      className="transition-all duration-500 ease-out"
      style={{
        opacity: open ? 1 : 0,
        letterSpacing: open ? 'normal' : '0.45em',
        filter: open ? 'blur(0px)' : 'blur(2px)',
      }}
    >
      {text}
    </p>
  )
}

/* ---------- effect: glitch in ---------- */
function GlitchText({ text, open }: { text: string; open: boolean }) {
  return (
    <p className={open ? 'lab-glitch' : ''} style={{ opacity: open ? 1 : 0, transition: 'opacity 0.15s' }}>
      {text}
    </p>
  )
}

type Variant =
  | 'slide'
  | 'unfold'
  | 'scramble'
  | 'dissolve'
  | 'redacted'
  | 'blur'
  | 'typewriter'
  | 'wordstagger'
  | 'wipe'
  | 'highlighter'
  | 'spotlight'
  | 'letterspread'
  | 'glitch'

function renderEffect(variant: Variant, text: string, open: boolean) {
  switch (variant) {
    case 'slide':
      return <SlideText text={text} open={open} />
    case 'unfold':
      return <UnfoldText text={text} open={open} />
    case 'scramble':
      return <ScrambleText text={text} open={open} />
    case 'dissolve':
      return <DissolveText text={text} open={open} />
    case 'redacted':
      return <RedactedText text={text} open={open} />
    case 'blur':
      return <BlurText text={text} open={open} />
    case 'typewriter':
      return <TypewriterText text={text} open={open} />
    case 'wordstagger':
      return <WordStaggerText text={text} open={open} />
    case 'wipe':
      return <WipeText text={text} open={open} />
    case 'highlighter':
      return <HighlighterText text={text} open={open} />
    case 'spotlight':
      return <SpotlightText text={text} open={open} />
    case 'letterspread':
      return <LetterSpreadText text={text} open={open} />
    case 'glitch':
      return <GlitchText text={text} open={open} />
  }
}

/* ---------- card ---------- */
function RevealCard({ variant, label }: { variant: Variant; label: string }) {
  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hovered || pinned

  return (
    <div>
      <div className="text-xs uppercase tracking-[0.2em] text-orange-500/70 mb-2 font-mono">{label}</div>

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative rounded-lg bg-nav/30 p-6 overflow-hidden"
      >
        {/* notebook grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(to bottom, transparent, transparent 19px, var(--text-secondary) 19px, var(--text-secondary) 20px),
              repeating-linear-gradient(to right, transparent, transparent 19px, var(--text-secondary) 19px, var(--text-secondary) 20px)
            `,
            opacity: 0.12,
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 80%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 80%, transparent 100%)',
          }}
        />

        <div className="relative">
          {/* Title — the interactive trigger */}
          <h2
            onClick={() => setPinned((p) => !p)}
            className="text-xl font-semibold inline-flex items-center gap-2 cursor-pointer select-none"
          >
            {SAMPLE.title}
            {/* affordance: chevron rotates when open */}
            <span
              className="text-orange-500 text-sm transition-transform duration-300"
              style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              ▸
            </span>
          </h2>

          {/* affordance: underline grows from a stub to full width on open */}
          <div
            className="h-0.5 bg-orange-500 mt-1 transition-all duration-300 ease-out"
            style={{ width: open ? '100%' : '2.5rem' }}
          />

          {/* Description (animated, collapsible) */}
          <Collapse open={open}>
            <div className="text-secondary pt-3 pb-1">{renderEffect(variant, SAMPLE.description, open)}</div>
          </Collapse>

          {/* Tech tags — always visible */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {SAMPLE.tech.map((tech) => (
              <span key={tech} className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500">
                {tech}
              </span>
            ))}
          </div>

          {/* Links — always visible */}
          <div className="flex flex-wrap gap-3">
            {SAMPLE.links.map((link) => (
              <span
                key={link.label}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-nav-hover text-secondary"
              >
                <span className="text-lg">{link.icon}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const VARIANTS: { variant: Variant; label: string }[] = [
  { variant: 'slide', label: '1 · Slide + Fade' },
  { variant: 'unfold', label: '2 · Paper Unfold (3D)' },
  { variant: 'scramble', label: '3 · Scramble / Decode' },
  { variant: 'dissolve', label: '4 · Dissolve / Grain' },
  { variant: 'redacted', label: '5 · Redacted → Reveal' },
  { variant: 'blur', label: '6 · Blur → Focus' },
  { variant: 'typewriter', label: '7 · Typewriter / Ink' },
  { variant: 'wordstagger', label: '8 · Word Stagger Up' },
  { variant: 'wipe', label: '9 · Wipe / Curtain' },
  { variant: 'highlighter', label: '10 · Highlighter Sweep' },
  { variant: 'spotlight', label: '11 · Spotlight Expand' },
  { variant: 'letterspread', label: '12 · Letter Spread' },
  { variant: 'glitch', label: '13 · Glitch In' },
]

export default function RevealsLab() {
  return (
    <main className="min-h-screen py-16 px-6">
      <style>{`
        @keyframes lab-glitch {
          0%   { transform: translateX(-3px); text-shadow: 2px 0 #e0455e, -2px 0 #45c8e0; }
          20%  { transform: translateX(3px);  text-shadow: -2px 0 #e0455e, 2px 0 #45c8e0; }
          40%  { transform: translateX(-2px); text-shadow: 1px 0 #e0455e, -1px 0 #45c8e0; }
          60%  { transform: translateX(2px);  text-shadow: -1px 0 #e0455e, 1px 0 #45c8e0; }
          80%  { transform: translateX(-1px); text-shadow: 1px 0 #e0455e; }
          100% { transform: translateX(0);    text-shadow: none; }
        }
        .lab-glitch { animation: lab-glitch 0.45s steps(2, end); }
      `}</style>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Text Reveal — Lab</h1>
        <p className="text-secondary mb-10">
          Hover a card (desktop) or tap the title (mobile) to reveal the description. Stack &amp; links stay
          visible. Compare the styles below.
        </p>

        <div className="space-y-12">
          {VARIANTS.map((v) => (
            <RevealCard key={v.variant} variant={v.variant} label={v.label} />
          ))}
        </div>
      </div>
    </main>
  )
}
