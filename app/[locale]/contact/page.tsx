'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail } from 'lucide-react'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function Contact() {
  const t = useTranslations('contact')
  const [status, setStatus] = useState<Status>('idle')
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })

  // Joke: a fake credit-card field that falls off when touched.
  const [cardDropped, setCardDropped] = useState(false)
  const [cardGone, setCardGone] = useState(false)
  const dropCard = () => {
    if (cardDropped) return
    setCardDropped(true)
    window.setTimeout(() => setCardGone(true), 750)
  }

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }))

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setForm({ name: '', email: '', message: '', website: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen py-20 px-8">
      <div className="max-w-xl mx-auto">
        {/* "I HVE A QUSTON" meme — taped to the wall */}
        <div className="relative w-44 sm:w-52 mx-auto mb-10 -rotate-2 hover:rotate-0 transition-transform duration-300">
          <img
            src="/question.png"
            alt="I have a question"
            className="relative w-full rounded-md border border-black/20 shadow-xl"
          />
          {/* washi tape strips */}
          <span className="absolute -top-2.5 -left-3 z-10 w-16 h-5 rotate-[-24deg] bg-gradient-to-b from-white/35 to-white/10 border border-white/20 shadow-sm" />
          <span className="absolute -top-2.5 -right-3 z-10 w-16 h-5 rotate-[24deg] bg-gradient-to-b from-white/35 to-white/10 border border-white/20 shadow-sm" />
        </div>

        <h1 className="text-4xl font-bold mb-3 text-center">{t('title')}</h1>
        <p className="text-secondary text-center mb-12">{t('subtitle')}</p>

        {status === 'success' ? (
          <div className="rounded-lg bg-orange-500/10 border border-orange-500/30 p-6 text-center">
            <p className="text-foreground">{t('success')}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5" noValidate>
            {/* Honeypot — hidden from users, tempting for bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={update('website')}
              className="hidden"
              aria-hidden="true"
            />

            <div>
              <label htmlFor="name" className="block text-sm text-secondary mb-1.5">
                {t('name')}
              </label>
              <input
                id="name"
                type="text"
                required
                value={form.name}
                onChange={update('name')}
                placeholder={t('namePlaceholder')}
                className="w-full rounded-lg bg-nav/40 border border-nav-hover px-4 py-2.5 outline-none focus:border-orange-500 transition-colors text-foreground placeholder:text-secondary"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm text-secondary mb-1.5">
                {t('email')}
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                placeholder={t('emailPlaceholder')}
                className="w-full rounded-lg bg-nav/40 border border-nav-hover px-4 py-2.5 outline-none focus:border-orange-500 transition-colors text-foreground placeholder:text-secondary"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm text-secondary mb-1.5">
                {t('message')}
              </label>
              <textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={update('message')}
                placeholder={t('messagePlaceholder')}
                className="w-full rounded-lg bg-nav/40 border border-nav-hover px-4 py-2.5 outline-none focus:border-orange-500 transition-colors text-foreground placeholder:text-secondary resize-y"
              />
            </div>

            {/* Joke: fake credit-card field that falls off; speech bubble rises in its place */}
            <div className="relative min-h-[70px]">
              {!cardGone ? (
                <div
                  onMouseEnter={dropCard}
                  onClick={dropCard}
                  className="cursor-pointer select-none"
                  style={{
                    transform: cardDropped ? 'translateY(120vh) rotate(16deg)' : 'none',
                    opacity: cardDropped ? 0 : 1,
                    transition: 'transform 0.75s cubic-bezier(0.5, 0, 0.9, 0.4), opacity 0.6s ease-in',
                    pointerEvents: cardDropped ? 'none' : 'auto',
                  }}
                >
                  <span className="block text-sm text-secondary mb-1.5">{t('fakeCardLabel')}</span>
                  <div className="w-full rounded-lg bg-nav/40 border border-nav-hover px-4 py-2.5 text-secondary/70 flex items-center justify-between">
                    <span className="tracking-widest">•••• •••• •••• ••••</span>
                    <span className="text-base">💳</span>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative animate-bubble-up">
                    <div className="bg-orange-500 text-white rounded-2xl px-4 py-2 shadow-lg text-center leading-tight">
                      <span className="block text-sm font-semibold">{t('justKidding')}</span>
                      <span className="block text-xs opacity-90">{t('freeToAsk')}</span>
                    </div>
                    {/* tail pointing down */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-3 h-3 bg-orange-500 rotate-45" />
                  </div>
                </div>
              )}
            </div>

            {status === 'error' && <p className="text-sm text-red-500">{t('error')}</p>}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-lg bg-orange-500 text-white font-medium py-2.5 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'sending' ? t('sending') : t('send')}
            </button>
          </form>
        )}

        {/* Direct email fallback */}
        <p className="text-secondary text-xs sm:text-sm text-center mt-8 whitespace-nowrap">
          {t('directLine')}{' '}
          <a href="mailto:contact@sohneg.ch" className="text-orange-500 hover:underline whitespace-nowrap">
            <Mail className="inline w-4 h-4 align-text-bottom mr-1" />
            contact@sohneg.ch
          </a>
        </p>
      </div>
    </main>
  )
}
