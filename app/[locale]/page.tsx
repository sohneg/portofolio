import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import LanguageCycleText from '@/components/LanguageCycleText'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  return {
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: ['/og-image.jpg'],
    },
  }
}

export default function Home() {
  const t = useTranslations('home')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 relative">
      {/* SVG filter for dissolving effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="dissolve-home">
            <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed={123} result="noise" />
            <feComponentTransfer in="noise" result="fade">
              <feFuncA type="linear" slope="2" intercept="-0.5" />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="fade" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* Math book grid background with dissolve effect */}
      <div
        className="absolute inset-0 pointer-events-none"
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
          filter: 'url(#dissolve-home)',
          maskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
        }}
      />

      <div className="relative flex flex-col items-center">
        <LanguageCycleText />
        <p className="text-lg text-secondary max-w-xl text-center">
          {t('description')}
        </p>
      </div>
    </main>
  )
}
