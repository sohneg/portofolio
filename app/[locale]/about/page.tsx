import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('about')

  return (
    <main className="min-h-screen flex flex-col justify-center max-w-2xl mx-auto p-8 relative">
      {/* SVG filter for dissolving effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="dissolve-about">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={456} result="noise" />
            <feComponentTransfer in="noise" result="fade">
              <feFuncA type="linear" slope="2" intercept="-0.5" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="fade" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Math book grid background with dissolve effect */}
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
        }}
      />

      <div className="relative">
        <h1 className="text-4xl font-bold mb-8">{t('title')}</h1>

        <div className="space-y-8">
          <div>
            <p className="text-sm text-secondary mb-2">{t('whoAmI')}</p>
            <p>{t('whoAmIText')}</p>
          </div>

          <div>
            <p className="text-sm text-secondary mb-2">{t('whatDoIDo')}</p>
            <p>{t('whatDoIDoText')}</p>
          </div>

          <div>
            <p className="text-sm text-secondary mb-2">{t('whatDoIWorkWith')}</p>
            <p>{t('whatDoIWorkWithText')}</p>
          </div>

          <div>
            <p className="text-sm text-secondary mb-2">{t('beyondCode')}</p>
            <p>{t('beyondCodeText')}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
