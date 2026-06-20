'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { FaGooglePlay, FaAppStoreIos, FaInstagram, FaTiktok, FaYoutube, FaGlobe } from 'react-icons/fa6'
import ProjectCard from '@/components/ProjectCard'
import { projects as projectData } from '@/data/projects'

// SVG filters for dissolving effect with different seeds
const DissolveFilters = () => (
  <svg className="absolute w-0 h-0">
    <defs>
      {[0, 1, 2, 3, 4, 5].map((seed) => (
        <filter key={seed} id={`dissolve-${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" seed={seed * 42} result="noise" />
          <feComponentTransfer in="noise" result="fade">
            <feFuncA type="linear" slope="2" intercept="-0.5" />
          </feComponentTransfer>
          <feComposite in="SourceGraphic" in2="fade" operator="in" />
        </filter>
      ))}
    </defs>
  </svg>
)

const projectLinks: Record<string, { icon: React.ReactNode; href: string; label: string; offline?: boolean }[]> = {
  pillPal: [
    { icon: <FaGooglePlay />, href: 'https://play.google.com/store/apps/details?id=ch.sohneg.pillpal', label: 'Google Play' },
  ],
  lapse: [
    { icon: <FaGooglePlay />, href: 'https://play.google.com/store/apps/details?id=ch.sohneg.lapse', label: 'Google Play' },
  ],
  tuningSchweiz: [
    { icon: <FaGooglePlay />, href: 'https://play.google.com/store/apps/details?id=ch.tuningschweiz', label: 'Google Play' },
    { icon: <FaAppStoreIos />, href: 'https://apps.apple.com/app/tuning-schweiz/id6502833192', label: 'App Store' },
    { icon: <FaGlobe />, href: 'https://tuning-schweiz.ch/', label: 'Website' },
    { icon: <FaInstagram />, href: 'https://www.instagram.com/tuningschweizofficial/', label: 'Instagram' },
    { icon: <FaTiktok />, href: 'https://www.tiktok.com/@tuningschweiz', label: 'TikTok' },
    { icon: <FaYoutube />, href: 'https://www.youtube.com/channel/UCAPprVHXAHkJG3DPFPnk8cA', label: 'YouTube' },
  ],
  mappli: [
    { icon: <FaGlobe />, href: 'https://mappli.ch/de', label: 'Mappli' },
  ],
  clientWebsites: [
    { icon: <FaGlobe />, href: 'https://chlitierpark.ch/', label: 'Chlitierpark Kriens' },
    { icon: <FaGlobe />, href: 'https://pflegeheld-dahoam.ch/', label: 'Pflegeheld Dahoam (offline)', offline: true },
    { icon: <FaGlobe />, href: 'https://tuning-emotion.ch/', label: 'Tuning Emotion' },
    { icon: <FaGlobe />, href: 'https://digisolve.ch/de', label: 'Digisolve' },
  ],
}

const projects = projectData.map(p => ({
  ...p,
  links: projectLinks[p.key],
}))

export default function Projects() {
  const t = useTranslations('projects')
  const [hasInteracted, setHasInteracted] = useState(false)

  return (
    <main className="min-h-screen py-20 px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-3 text-center">{t('title')}</h1>

        {/* Interaction hint — fades out after the first reveal */}
        <p
          className="text-secondary text-sm text-center mb-14 transition-opacity duration-500"
          style={{ opacity: hasInteracted ? 0 : 0.7 }}
          aria-hidden={hasInteracted}
        >
          {t('hint')}
        </p>

        <DissolveFilters />

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-orange-500/50 to-transparent" />

          {/* Projects */}
          <div className="space-y-12">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.key}
                projectKey={project.key}
                index={index}
                tech={project.tech}
                links={project.links}
                isFirst={index === 0}
                onReveal={() => setHasInteracted(true)}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
