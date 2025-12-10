import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/routing'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold mb-6">{t('title')}</h1>
      <p className="text-lg text-secondary mb-8">{t('message')}</p>
      <Link
        href="/"
        className="px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
      >
        {t('goHome')}
      </Link>
    </main>
  )
}
