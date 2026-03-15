'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Circle, ArrowRight, Code, Briefcase, Rocket, Heart, Smile } from 'lucide-react'
import GridBackground from '@/components/GridBackground'
import PageAtmosphere from '@/components/PageAtmosphere'

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
  { id: 'side', icon: <Rocket />, titleKey: 'chapter5Title', textKey: 'chapter5Text' },
  { id: 'passion', icon: <Heart />, titleKey: 'chapter6Title', textKey: 'chapter6Text' },
  { id: 'life', icon: <Smile />, titleKey: 'chapter7Title', textKey: 'chapter7Text' },
]

export default function About() {
  const t = useTranslations('about')
  const [scrollY, setScrollY] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const [activeSectionIdx, setActiveSectionIdx] = useState(-1)
  const [transitionProgress, setTransitionProgress] = useState(0)

  const updateActiveSection = useCallback(() => {
    const viewportCenter = scrollY + window.innerHeight * 0.45

    let bestIdx = -1
    let bestDist = Infinity

    // Check if viewport is still in the hero area (above first section)
    const firstRef = sectionRefs.current[0]
    if (firstRef) {
      const firstTop = firstRef.getBoundingClientRect().top + window.scrollY
      if (viewportCenter < firstTop) {
        // Still in hero - no atmosphere
        setActiveSectionIdx(-1)
        setTransitionProgress(0)
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

    setActiveSectionIdx(bestIdx)

    if (bestIdx >= 0 && bestIdx < sections.length - 1) {
      const currentRef = sectionRefs.current[bestIdx]
      const nextRef = sectionRefs.current[bestIdx + 1]
      if (currentRef && nextRef) {
        const currentCenter = currentRef.getBoundingClientRect().top + window.scrollY + currentRef.offsetHeight / 2
        const nextCenter = nextRef.getBoundingClientRect().top + window.scrollY + nextRef.offsetHeight / 2
        const range = nextCenter - currentCenter
        const rawProgress = range > 0 ? (viewportCenter - currentCenter) / range : 0

        // Deadzone: atmosphere stays stable for the middle 60% of each section
        // Only transitions in the last 20% → first 20% between sections
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
        setTransitionProgress(Math.max(0, Math.min(1, mapped)))
      }
    } else {
      setTransitionProgress(0)
    }
  }, [scrollY])

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)

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

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    updateActiveSection()
  }, [updateActiveSection])

  const activeId = activeSectionIdx >= 0 ? sections[activeSectionIdx].id : 'default'
  const nextId = activeSectionIdx >= 0 && activeSectionIdx < sections.length - 1
    ? sections[activeSectionIdx + 1].id
    : activeId

  return (
    <main data-about-page className="relative overflow-hidden transition-[background-color,color] duration-700">
      <PageAtmosphere
        activeSection={activeId}
        transitionProgress={transitionProgress}
        nextSection={nextId}
      />

      <GridBackground
        filterId="dissolve-about"
        filterSeed={789}
        filterFrequency={0.015}
        filterSlope={2.5}
        filterIntercept={-0.6}
        fixed
        style={{ transform: `translateY(${scrollY * -0.1}px)` }}
      />

      {/* Hero - normal site theme */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-8 md:pl-24 z-[2]">
        <div
          className="text-center"
          style={{ transform: `translateY(${scrollY * 0.4}px)`, opacity: Math.max(0, 1 - scrollY / 400) }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl opacity-70 max-w-lg mx-auto">{t('subtitle')}</p>
        </div>

        <div
          className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <span className="text-sm opacity-50">{t('scrollHint')}</span>
          <div className="w-6 h-10 border-2 border-current opacity-30 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-current opacity-50 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Fullscreen story sections */}
      {sections.map((section, index) => (
        <section
          key={section.id}
          id={section.id}
          ref={(el) => { sectionRefs.current[index] = el }}
          className="min-h-screen flex items-center justify-center relative px-8 md:pl-24 z-[2]"
        >
          <div
            className={`max-w-2xl mx-auto text-center transition-all duration-1000 ease-out
              ${visibleSections.has(section.id)
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-16'}`}
          >
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8
                transition-all duration-700
                ${visibleSections.has(section.id) ? 'scale-100 rotate-0' : 'scale-0 -rotate-12'}`}
              style={{ transitionDelay: '200ms' }}
            >
              <div className="w-full h-full flex items-center justify-center">
                {section.icon}
              </div>
            </div>

            {/* Title */}
            <h2
              className={`text-3xl md:text-5xl font-bold mb-6
                transition-all duration-700
                ${visibleSections.has(section.id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '400ms' }}
            >
              {t(section.titleKey)}
            </h2>

            {/* Text */}
            <p
              className={`text-lg md:text-xl leading-relaxed opacity-80
                transition-all duration-700
                ${visibleSections.has(section.id) ? 'opacity-80 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: '600ms' }}
            >
              {t(section.textKey)}
            </p>
          </div>
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
    </main>
  )
}
