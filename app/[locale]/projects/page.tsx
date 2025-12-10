import { useTranslations } from 'next-intl'
import { FaGooglePlay, FaAppStoreIos, FaInstagram, FaTiktok, FaYoutube, FaGlobe } from 'react-icons/fa6'
import Tooltip from '@/components/Tooltip'
import ThoughtBubble from '@/components/ThoughtBubble'

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

const projects = [
  {
    key: 'tuningSchweiz',
    tech: ['Flutter', 'Dart', 'Laravel', 'Firebase', 'Angular'],
    links: [
      { icon: <FaGooglePlay />, href: 'https://play.google.com/store/apps/details?id=ch.tuningschweiz', label: 'Google Play' },
      { icon: <FaAppStoreIos />, href: 'https://apps.apple.com/app/tuning-schweiz/id6502833192', label: 'App Store' },
      { icon: <FaGlobe />, href: 'https://tuning-schweiz.ch/', label: 'Website' },
      { icon: <FaInstagram />, href: 'https://www.instagram.com/tuningschweizofficial/', label: 'Instagram' },
      { icon: <FaTiktok />, href: 'https://www.tiktok.com/@tuningschweiz', label: 'TikTok' },
      { icon: <FaYoutube />, href: 'https://www.youtube.com/channel/UCAPprVHXAHkJG3DPFPnk8cA', label: 'YouTube' },
    ],
  },
  {
    key: 'businessSystem',
    tech: ['C#', 'Blazor', 'WPF', 'SQL Server'],
  },
  {
    key: 'vrElevator',
    tech: ['Unity 6', 'C#', 'Meta Quest 3'],
  },
  {
    key: 'dogCamera',
    tech: ['Raspberry Pi', 'Python', 'Discord API'],
  },
  {
    key: 'crowDesk',
    tech: ['React', 'PostgreSQL', 'Node.js'],
    links: [
      { icon: <FaGlobe />, href: 'https://www.crow-desk.com/', label: 'Crow Desk' },
    ],
  },
  {
    key: 'syncShift',
    tech: ['Flutter', 'Dart', 'Android', 'iOS'],
  },
  {
    key: 'clientWebsites',
    tech: ['WordPress', 'Angular', 'PHP', 'CSS'],
    links: [
      { icon: <FaGlobe />, href: 'https://chlitierpark.ch/', label: 'Chlitierpark Kriens' },
      { icon: <FaGlobe />, href: 'https://pflegeheld-dahoam.ch/', label: 'Pflegeheld Dahoam' },
      { icon: <FaGlobe />, href: 'https://tuning-emotion.ch/', label: 'Tuning Emotion' },
    ],
  },
]

export default function Projects() {
  const t = useTranslations('projects')

  return (
    <main className="min-h-screen py-20 px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-16 text-center">{t('title')}</h1>

        <DissolveFilters />

        {/* Timeline container */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-orange-500 via-orange-500/50 to-transparent" />

          {/* Projects */}
          <div className="space-y-12">
            {projects.map((project, index) => (
              <div key={project.key} className="relative pl-8 md:pl-20">
                {/* Timeline dot with thought bubble */}
                <div className="absolute left-0 md:left-8 top-2 -translate-x-1/2 z-[100]">
                  <ThoughtBubble text={t(`${project.key}.thought`)}>
                    <div className="relative cursor-pointer group flex items-center justify-center w-6 h-6">
                      {/* Pulse ring */}
                      <div className="absolute w-3 h-3 rounded-full bg-orange-500 animate-gentle-pulse" />
                      {/* Main dot with glow */}
                      <div className="relative w-3 h-3 rounded-full bg-orange-500 animate-soft-glow group-hover:scale-150 transition-transform duration-200" />
                    </div>
                  </ThoughtBubble>
                </div>

                {/* Project card with notebook lines */}
                <div className="relative rounded-lg bg-nav/30 p-6">
                  {/* Math book grid background with dissolve effect */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
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
                      filter: `url(#dissolve-${index % 6})`,
                      maskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.4) 85%, transparent 100%)',
                      WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.4) 85%, transparent 100%)',
                    }}
                  />

                  {/* Content */}
                  <div className="relative">
                    {/* Title with underline */}
                    <h2 className="text-xl font-semibold mb-1 inline-block">
                      {t(`${project.key}.title`)}
                      <div className="h-0.5 bg-orange-500 mt-1 w-full" />
                    </h2>

                    <p className="text-secondary mt-3 mb-4">
                      {t(`${project.key}.description`)}
                    </p>

                    {/* Tech tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    {project.links && (
                      <div className="flex flex-wrap gap-3">
                        {project.links.map((link) => (
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
