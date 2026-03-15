'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Circle, ArrowRight, Code, Briefcase, Car, Dices, Server, Smile } from 'lucide-react'
import { VT323 } from 'next/font/google'
import GridBackground from '@/components/GridBackground'
import PageAtmosphere, { type PageAtmosphereHandle } from '@/components/PageAtmosphere'
import KeywordZoom from '@/components/KeywordZoom'
import TerminalSequence from '@/components/TerminalSequence'
import ScrollSnap from '@/components/ScrollSnap'
import BootSequence from '@/components/BootSequence'
import WorkTabs from '@/components/WorkTabs'

const terminalFont = VT323({ weight: '400', subsets: ['latin'] })

interface Section {
  id: string
  icon: React.ReactNode
  titleKey: string
  textKey: string
}

const sections: Section[] = [
  { id: 'baker', icon: <Circle />, titleKey: 'chapter1Title', textKey: 'chapter1Text' },
  { id: 'change', icon: <ArrowRight />, titleKey: 'chapter2Title', textKey: 'chapter2Text' },
  { id: 'code', icon: <Code />, titleKey: 'chapter3Title', textKey: 'chapter3Text' },
  { id: 'work', icon: <Briefcase />, titleKey: 'chapter4Title', textKey: 'chapter4Text' },
  { id: 'tuning', icon: <Car />, titleKey: 'chapter5Title', textKey: 'chapter5Text' },
  { id: 'dice', icon: <Dices />, titleKey: 'chapter6Title', textKey: 'chapter6Text' },
  { id: 'infra', icon: <Server />, titleKey: 'chapter7Title', textKey: 'chapter7Text' },
  { id: 'life', icon: <Smile />, titleKey: 'chapter8Title', textKey: 'chapter8Text' },
]

export default function About() {
  const t = useTranslations('about')
  // Use refs instead of state for scroll-driven values to avoid re-renders
  const scrollYRef = useRef(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const activeSectionIdxRef = useRef(-1)
  const transitionProgressRef = useRef(0)
  const [visitorIp, setVisitorIp] = useState('')
  // Refs for direct DOM manipulation of scroll-driven elements
  const heroRef = useRef<HTMLDivElement>(null)
  const scrollHintRef = useRef<HTMLDivElement>(null)
  const gridBgRef = useRef<HTMLDivElement>(null)
  // Ref for PageAtmosphere imperative updates
  const atmosphereRef = useRef<PageAtmosphereHandle>(null)
  const rafRef = useRef(0)
  const lastScrollYRef = useRef(-1)
  // Boot sequence state
  const [bootActive, setBootActive] = useState(false)

  useEffect(() => {
    fetch('https://api.ipify.org?format=text')
      .then(r => r.text())
      .then(ip => setVisitorIp(ip))
      .catch(() => {})
  }, [])

  const updateActiveSection = useCallback(() => {
    const scrollY = scrollYRef.current
    const viewportCenter = scrollY + window.innerHeight * 0.45

    let bestIdx = -1
    let bestDist = Infinity

    // Check if viewport is still in the hero area (above first section)
    const firstRef = sectionRefs.current[0]
    if (firstRef) {
      const firstTop = firstRef.getBoundingClientRect().top + window.scrollY
      if (viewportCenter < firstTop) {
        // Still in hero - no atmosphere
        activeSectionIdxRef.current = -1
        transitionProgressRef.current = 0
        atmosphereRef.current?.update('default', 'default', 0)
        return
      }
    }

    sectionRefs.current.forEach((ref, i) => {
      if (!ref) return
      const rect = ref.getBoundingClientRect()
      const sectionCenter = rect.top + window.scrollY + rect.height / 2
      const dist = Math.abs(viewportCenter - sectionCenter)
      if (dist < bestDist) {
        bestDist = dist
        bestIdx = i
      }
    })

    activeSectionIdxRef.current = bestIdx

    let transitionProgress = 0
    if (bestIdx >= 0 && bestIdx < sections.length - 1) {
      const currentRef = sectionRefs.current[bestIdx]
      const nextRef = sectionRefs.current[bestIdx + 1]
      if (currentRef && nextRef) {
        const currentCenter = currentRef.getBoundingClientRect().top + window.scrollY + currentRef.offsetHeight / 2
        const nextCenter = nextRef.getBoundingClientRect().top + window.scrollY + nextRef.offsetHeight / 2
        const range = nextCenter - currentCenter
        const rawProgress = range > 0 ? (viewportCenter - currentCenter) / range : 0

        // Deadzone: atmosphere stays stable for the middle 60% of each section
        const deadStart = 0.4
        const deadEnd = 0.6
        let mapped: number
        if (rawProgress <= deadStart) {
          mapped = 0
        } else if (rawProgress >= deadEnd) {
          mapped = (rawProgress - deadEnd) / (1 - deadEnd)
        } else {
          mapped = 0
        }
        transitionProgress = Math.max(0, Math.min(1, mapped))
      }
    }
    transitionProgressRef.current = transitionProgress

    // Update atmosphere via imperative handle (no state, no re-render)
    const activeId = bestIdx >= 0 ? sections[bestIdx].id : 'default'
    const nextId = bestIdx >= 0 && bestIdx < sections.length - 1
      ? sections[bestIdx + 1].id
      : activeId
    atmosphereRef.current?.update(activeId, nextId, transitionProgress)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY
      // Skip if scroll position hasn't changed
      if (sy === lastScrollYRef.current) return
      lastScrollYRef.current = sy
      scrollYRef.current = sy

      // Direct DOM updates for scroll-driven elements (no React state)
      if (heroRef.current) {
        heroRef.current.style.opacity = String(Math.max(0, 1 - sy / 300))
      }
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = String(Math.max(0, 1 - sy / 200))
      }
      if (gridBgRef.current) {
        gridBgRef.current.style.transform = `translateY(${sy * -0.02}px)`
      }


      // Throttle active section calculation with rAF
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          updateActiveSection()
          rafRef.current = 0
        })
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.3 }
    )

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    window.addEventListener('scroll', onScroll, { passive: true })
    // Initial call
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      observer.disconnect()
    }
  }, [updateActiveSection])

  return (
    <main data-about-page className="relative transition-[background-color,color] duration-700">
      <BootSequence
        active={bootActive}
        onDone={() => setBootActive(false)}
      />
      <PageAtmosphere
        ref={atmosphereRef}
        activeSection="default"
        transitionProgress={0}
        nextSection="default"
      />

      <div ref={gridBgRef} className="fixed inset-0 z-[1]" style={{ willChange: 'transform' }}>
        <GridBackground
          filterId="dissolve-about"
          filterSeed={789}
          filterFrequency={0.015}
          filterSlope={2.5}
          filterIntercept={-0.6}
        />
      </div>

      {/* Hero + 3D keyword zoom combined */}
      <KeywordZoom
        flyInContent={
          <div className="font-serif">
            <h2 className="text-2xl md:text-5xl font-bold mb-4 md:mb-6">{t('chapter1Title')}</h2>
            <p className="text-sm md:text-xl leading-relaxed opacity-80">{t('chapter1Text')}</p>
          </div>
        }
        flyInTitle={t('chapter1Title')}
        flyInText={t('chapter1Text')}
        flyInRef={(el) => { sectionRefs.current[0] = el }}
      >
        {/* Hero content floats on top, fades out as you scroll */}
        <div
          ref={heroRef}
          className="absolute inset-0 flex flex-col justify-center items-center px-8 md:pl-24 z-10 pointer-events-none"
          style={{ willChange: 'opacity' }}
        >
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">{t('title')}</h1>
            <p className="text-xl opacity-70 max-w-lg mx-auto">{t('subtitle')}</p>
          </div>

          {/* Desktop: scroll hint */}
          <div
            ref={scrollHintRef}
            className="absolute bottom-12 hidden md:flex flex-col items-center gap-2 animate-bounce"
            style={{ willChange: 'opacity' }}
          >
            <span className="text-sm opacity-50">{t('scrollHint')}</span>
            <div className="w-6 h-10 border-2 border-current opacity-30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-current opacity-50 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </KeywordZoom>

      {/* Bread impact transition: baker → wendepunkt */}
      {/* Fullscreen story sections */}
      <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>
      {sections.slice(1).map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          ref={(el) => { sectionRefs.current[index + 1] = el }}
          className="min-h-screen flex items-center pb-[15vh] md:pb-0 justify-center relative px-8 md:pl-24 z-[2]"
        >
          {section.id === 'work' ? (
            /* Dashboard layout for Work section */
            <div
              className={`w-full max-w-4xl mx-auto transition-all duration-1000 ease-out
                ${visibleSections.has(section.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'}`}
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                {/* Header */}
                <div className="px-6 py-4 md:px-8 md:py-5 border-b border-white/10 flex items-center justify-between">
                  <h2 className="text-xl md:text-3xl font-bold">{t(section.titleKey)}</h2>
                  <span className="text-xs md:text-sm opacity-50">Brabender Solutions</span>
                </div>

                {/* Text - short on mobile, full on desktop */}
                <div className="px-6 py-5 md:px-8 md:py-6 border-b border-white/10">
                  <p className="hidden md:block text-lg leading-relaxed opacity-80">{t(section.textKey)}</p>
                  <p className="md:hidden text-sm leading-relaxed opacity-80">{t('chapter4TextShort')}</p>
                </div>

                {/* Tabs + Chips */}
                <WorkTabs visible={visibleSections.has(section.id)} />
              </div>
            </div>
          ) : section.id === 'code' ? (
            /* Terminal window for Code section */
            <div
              className={`w-full max-w-4xl mx-auto transition-all duration-1000 ease-out
                ${visibleSections.has(section.id)
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-16 scale-95'}`}
            >
              <div className={`bg-gray-950 border border-gray-700 rounded-xl shadow-2xl shadow-green-500/10 ${terminalFont.className}`}>
                {/* macOS title bar */}
                <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 border-b border-gray-800">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 text-xs text-gray-500">root@sohneg.ch — bash</span>
                </div>

                {/* Scanline overlay */}
                <div className="absolute inset-0 top-[42px] pointer-events-none rounded-b-xl"
                  style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.02) 1px, rgba(0,255,65,0.02) 2px)' }} />

                {/* Terminal content */}
                <div className="relative p-3 md:p-8 text-sm md:text-xl leading-relaxed">
                  {/* Invisible placeholder to reserve full size */}
                  <div aria-hidden="true" className="invisible">
                    <div>Last login: Wed Mar 15 00:00:00 2026 from 000.000.000.000</div>
                    <div>root@sohneg.ch:~# cat {t(section.titleKey).toLowerCase().replace(/\s+/g, '_')}.txt</div>
                    <div>{t(section.textKey)}</div>
                    <div>root@sohneg.ch:~# |</div>
                  </div>
                  {/* Visible overlay - scrollable, hidden scrollbar */}
                  <div
                    data-terminal-scroll
                    className="absolute inset-0 p-3 md:p-8 overflow-y-auto overscroll-contain"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <TerminalSequence
                      loginText={`Last login: ${new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', year: 'numeric', hour12: false })}${visitorIp ? ` from ${visitorIp}` : ''}`}
                      command={`cat ${t(section.titleKey).toLowerCase().replace(/\s+/g, '_')}.txt`}
                      output={t(section.textKey)}
                      trigger={visibleSections.has(section.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Default section layout */
            <div
              className={`max-w-2xl mx-auto text-center transition-all duration-1000 ease-out
                ${visibleSections.has(section.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-16'}`}
            >
              {/* Title */}
              <h2
                className={`text-2xl md:text-5xl font-bold mb-4 md:mb-6
                  transition-all duration-700
                  ${visibleSections.has(section.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '400ms' }}
              >
                {t(section.titleKey)}
              </h2>

              {/* Text */}
              <p
                className={`text-sm md:text-xl leading-relaxed opacity-80
                  transition-all duration-700
                  ${visibleSections.has(section.id) ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ transitionDelay: '600ms' }}
              >
                {t(section.textKey)}
              </p>
            </div>
          )}
        </section>
      ))}

      {/* Closing quote */}
      <section className="min-h-[50vh] flex items-center justify-center px-8 md:pl-24 z-[2]">
        <div
          className={`text-center transition-all duration-700
            ${visibleSections.has('life') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '800ms' }}
        >
          <p className="text-2xl md:text-3xl font-light opacity-70 italic">
            {t('closingQuote')}
          </p>
        </div>
      </section>

      <ScrollSnap
        targets={[
          ...sections.slice(1).map(s => `#${s.id}`),
        ]}
        noSnapZone="[data-keyword-zoom]"
        onNavigate={(fromId, toId) => {
          // Trigger boot sequence when navigating from wendepunkt to terminal
          if (fromId === 'change' && toId === 'code') {
            setBootActive(true)
            return 'block' // prevent normal scroll, boot handles it
          }
        }}
      />
    </main>
  )
}
