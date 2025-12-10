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
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <LanguageCycleText />
      <p className="text-lg text-secondary max-w-xl text-center">
        {t('description')}
      </p>
    </main>
  )
}
