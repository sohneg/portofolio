'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import Tooltip from './Tooltip'
import ThoughtBubble from './ThoughtBubble'

interface ProjectLink {
  icon: React.ReactNode
  href: string
  label: string
  offline?: boolean
}

interface ProjectCardProps {
  projectKey: string
  index: number
  tech: string[]
  links?: ProjectLink[]
  isFirst: boolean
  onReveal: () => void
}

export default function ProjectCard({ projectKey, index, tech, links, isFirst, onReveal }: ProjectCardProps) {
  const t = useTranslations('projects')

  const [hovered, setHovered] = useState(false)
  const [pinned, setPinned] = useState(false)
  const open = hovered || pinned

  // Remount key to replay the glitch animation on every open.
  const [revealKey, setRevealKey] = useState(0)
  const prevOpen = useRef(false)
  const notified = useRef(false)

  useEffect(() => {
    if (open && !prevOpen.current) {
      setRevealKey((k) => k + 1)
      if (!notified.current) {
        notified.current = true
        onReveal()
      }
    }
    prevOpen.current = open
  }, [open, onReveal])

  // Auto-teaser: glitch the first title once, ~1s after load.
  const [teaserKey, setTeaserKey] = useState(0)
  const [teasing, setTeasing] = useState(false)
  useEffect(() => {
    if (!isFirst) return
    const start = window.setTimeout(() => {
      setTeasing(true)
      setTeaserKey((k) => k + 1)
      const stop = window.setTimeout(() => setTeasing(false), 500)
      return () => window.clearTimeout(stop)
    }, 1000)
    return () => window.clearTimeout(start)
  }, [isFirst])

  return (
    <div className="relative pl-8 md:pl-20">
      {/* Timeline dot with thought bubble */}
      <div className="absolute left-0 md:left-8 top-2 -translate-x-1/2 z-[100]">
        <ThoughtBubble text={t(`${projectKey}.thought`)}>
          <div className="relative cursor-pointer group flex items-center justify-center w-6 h-6">
            <div className="absolute w-3 h-3 rounded-full bg-orange-500 animate-gentle-pulse" />
            <div className="relative w-3 h-3 rounded-full bg-orange-500 animate-soft-glow group-hover:scale-150 transition-transform duration-200" />
          </div>
        </ThoughtBubble>
      </div>

      {/* Project card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative rounded-lg bg-nav/30 p-6"
      >
        {/* Math book grid background with dissolve effect */}
        <div
          className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
          style={{
            backgroundImage: `
              repeating-linear-gradient(to bottom, transparent, transparent 19px, var(--text-secondary) 19px, var(--text-secondary) 20px),
              repeating-linear-gradient(to right, transparent, transparent 19px, var(--text-secondary) 19px, var(--text-secondary) 20px)
            `,
            opacity: 0.25,
            filter: `url(#dissolve-${index % 6})`,
            maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.4) 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.4) 85%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div className="relative">
          {/* Title — interactive trigger */}
          <h2 className="text-xl font-semibold inline-block">
            <button
              type="button"
              onClick={() => setPinned((p) => !p)}
              aria-expanded={open}
              className="inline-flex items-center gap-2 cursor-pointer select-none text-left"
            >
              <span key={teaserKey} className={teasing ? 'animate-glitch-in inline-block' : 'inline-block'}>
                {t(`${projectKey}.title`)}
              </span>
              {/* affordance: chevron rotates when open */}
              <span
                className="text-orange-500 text-sm transition-transform duration-300"
                style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
                aria-hidden="true"
              >
                ▸
              </span>
            </button>
          </h2>

          {/* affordance: underline grows from stub to full width */}
          <div
            className="h-0.5 bg-orange-500 mt-1 transition-all duration-300 ease-out"
            style={{ width: open ? '100%' : '2.5rem' }}
          />

          {/* Description — collapsible, glitch-in on reveal */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden min-h-0">
              <p
                key={revealKey}
                className={`text-secondary pt-3 pb-1 ${open ? 'animate-glitch-in' : ''}`}
                style={{ opacity: open ? 1 : 0 }}
              >
                {t(`${projectKey}.description`)}
              </p>
            </div>
          </div>

          {/* Tech tags — always visible */}
          <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {tech.map((item) => (
              <span key={item} className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500">
                {item}
              </span>
            ))}
          </div>

          {/* Links — always visible */}
          {links && (
            <div className="flex flex-wrap gap-3">
              {links.map((link) =>
                link.offline ? (
                  <Tooltip key={link.href} text={link.label}>
                    <span
                      aria-label={link.label}
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-nav-hover text-secondary/40 grayscale cursor-not-allowed relative"
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="absolute w-7 h-px bg-current rotate-45" />
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip key={link.href} text={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-nav-hover hover:bg-orange-500 hover:text-white text-secondary transition-all"
                    >
                      <span className="text-lg">{link.icon}</span>
                    </a>
                  </Tooltip>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
