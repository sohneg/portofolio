'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useRef, useState } from 'react'
import { Circle, ArrowRight, Code, Briefcase, Rocket, Heart, Smile } from 'lucide-react'

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

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
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

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [])


  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* SVG filter for dissolving effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="dissolve-about">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed={789} result="noise" />
            <feComponentTransfer in="noise" result="fade">
              <feFuncA type="linear" slope="2.5" intercept="-0.6" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="fade" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Math book grid background with dissolve and parallax */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 19px,
              var(--text-secondary) 19px,
              var(--text-secondary) 20px
            ),
            repeating-linear-gradient(
              to right,
              transparent,
              transparent 19px,
              var(--text-secondary) 19px,
              var(--text-secondary) 20px
            )
          `,
          opacity: 0.25,
          filter: 'url(#dissolve-about)',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
          transform: `translateY(${scrollY * -0.1}px)`,
        }}
      />


      {/* Hero section */}
      <section className="min-h-screen flex flex-col justify-center items-center relative px-8">
        <div
          className="text-center"
          style={{ transform: `translateY(${scrollY * 0.4}px)`, opacity: Math.max(0, 1 - scrollY / 400) }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6">{t('title')}</h1>
          <p className="text-xl text-secondary max-w-lg mx-auto">{t('subtitle')}</p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12 flex flex-col items-center gap-2 animate-bounce"
          style={{ opacity: Math.max(0, 1 - scrollY / 200) }}
        >
          <span className="text-sm text-secondary">{t('scrollHint')}</span>
          <div className="w-6 h-10 border-2 border-secondary rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-secondary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Story sections */}
      <div className="relative max-w-4xl mx-auto px-8 pb-32">
        {/* Timeline line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-secondary/30 to-transparent" />

        {sections.map((section, index) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => { sectionRefs.current[index] = el }}
            className={`relative py-24 md:py-32 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'}`}
          >
            {/* Timeline dot */}
            <div
              className={`absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-orange-500
                transition-all duration-700 ${visibleSections.has(section.id) ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
              style={{ transitionDelay: '200ms' }}
            />

            {/* Content card */}
            <div
              className={`ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-16' : 'md:ml-16'}
                transition-all duration-700 ease-out
                ${visibleSections.has(section.id)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'}`}
            >
              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500 text-white mb-6
                  transition-all duration-500 ${visibleSections.has(section.id) ? 'scale-100 rotate-0' : 'scale-0 -rotate-12'}`}
                style={{ transitionDelay: '400ms' }}
              >
                {section.icon}
              </div>

              {/* Title */}
              <h2
                className={`text-2xl md:text-3xl font-bold mb-4
                  transition-all duration-500 ${visibleSections.has(section.id) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: '500ms' }}
              >
                {t(section.titleKey)}
              </h2>

              {/* Text */}
              <p
                className={`text-lg text-secondary leading-relaxed
                  transition-all duration-500 ${visibleSections.has(section.id) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: '600ms' }}
              >
                {t(section.textKey)}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* End section */}
      <section className="min-h-[50vh] flex items-center justify-center px-8 pb-32">
        <div
          className={`text-center transition-all duration-700
            ${visibleSections.has('life') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '800ms' }}
        >
          <p className="text-2xl md:text-3xl font-light text-secondary italic">
            {t('closingQuote')}
          </p>
        </div>
      </section>
    </main>
  )
}
