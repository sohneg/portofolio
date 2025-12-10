import { useTranslations } from 'next-intl'

export default function About() {
  const t = useTranslations('about')

  return (
    <main className="min-h-screen flex flex-col justify-center max-w-2xl mx-auto p-8">
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
    </main>
  )
}
