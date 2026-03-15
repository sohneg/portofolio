'use client'

import type { ReactNode } from 'react'

interface ChapterCardProps {
  chapterId: string
  icon: ReactNode
  title: string
  text: string
  isVisible: boolean
}

function BakerCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative bg-amber-50/80 dark:bg-amber-950/30 rounded-xl shadow-md p-6 border border-amber-200/50 dark:border-amber-800/30"
      style={{ transform: 'rotate(-1deg)' }}>
      <h3 className="font-serif text-xl font-bold mb-2">{title}</h3>
      <svg width="100%" height="12" className="mb-3" aria-hidden="true">
        <path d="M0 6 Q15 0, 30 6 T60 6 T90 6 T120 6 T150 6 T180 6 T210 6 T240 6 T270 6 T300 6"
          stroke="#d97706" strokeWidth="1.5" fill="none" strokeOpacity="0.5" />
      </svg>
      <p className="text-sm leading-relaxed opacity-80">{text}</p>
    </div>
  )
}

function ChangeCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative rounded-xl shadow-md p-6 overflow-hidden"
      style={{
        background: 'linear-gradient(to right, rgba(255,251,235,0.6) 50%, rgba(241,245,249,0.6) 50%)',
      }}>
      <div className="absolute inset-0 dark:hidden pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.02) 10px, rgba(0,0,0,0.02) 11px)' }} />
      <div className="absolute inset-0 hidden dark:block pointer-events-none"
        style={{
          background: 'linear-gradient(to right, rgba(120,53,15,0.3) 50%, rgba(30,41,59,0.3) 50%)',
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.02) 10px, rgba(255,255,255,0.02) 11px)',
        }} />
      <svg className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-4 pointer-events-none" aria-hidden="true">
        <path d="M8 0 L4 10 L12 20 L4 30 L12 40 L4 50 L12 60 L4 70 L12 80 L4 90 L12 100 L8 110 L4 120 L12 130 L4 140 L12 150 L8 160 L4 170 L12 180 L4 190 L12 200"
          stroke="currentColor" strokeWidth="1" fill="none" strokeOpacity="0.15" />
      </svg>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm leading-relaxed opacity-80">{text}</p>
      </div>
    </div>
  )
}

function CodeCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative bg-gray-950 border border-gray-800 rounded-xl shadow-md overflow-hidden">
      <style>{`@keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }`}</style>
      <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-900 border-b border-gray-800">
        <span className="w-3 h-3 rounded-full bg-red-500" />
        <span className="w-3 h-3 rounded-full bg-yellow-500" />
        <span className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      <div className="absolute inset-0 top-[38px] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.03) 1px, rgba(255,255,255,0.03) 2px)' }} />
      <div className="relative p-6">
        <h3 className="font-mono text-lg font-bold text-green-400 mb-3">
          <span className="text-green-600">$ </span>{title}
          <span className="inline-block ml-1 w-2 text-green-400" style={{ animation: 'blink 1s step-end infinite' }}>|</span>
        </h3>
        <p className="font-mono text-sm leading-relaxed text-green-400/80">{text}</p>
      </div>
    </div>
  )
}

function WorkCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 rounded-xl shadow-md p-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(128,128,128,0.15) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm leading-relaxed opacity-80">{text}</p>
      </div>
    </div>
  )
}

function SideCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative bg-blue-950/90 text-blue-100 rounded-xl shadow-md p-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(96,165,250,0.07) 0px, rgba(96,165,250,0.07) 1px, transparent 1px, transparent 20px), repeating-linear-gradient(90deg, rgba(96,165,250,0.07) 0px, rgba(96,165,250,0.07) 1px, transparent 1px, transparent 20px)',
        }} />
      {/* Corner brackets */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t border-l border-white/40" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t border-r border-white/40" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b border-l border-white/40" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-white/40" />
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-1">{title}</h3>
        <div className="w-16 h-px bg-blue-400/50 mb-3" />
        <p className="text-sm leading-relaxed text-blue-200/80">{text}</p>
      </div>
    </div>
  )
}

function PassionCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative border border-orange-500/20 rounded-xl shadow-lg shadow-orange-500/10 p-6 overflow-hidden"
      style={{ background: 'radial-gradient(circle at center, rgba(249,115,22,0.1), transparent 70%)' }}>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3" style={{ textShadow: '0 0 20px rgba(249,115,22,0.3)' }}>{title}</h3>
        <p className="text-sm leading-relaxed opacity-80">{text}</p>
      </div>
    </div>
  )
}

function LifeCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="relative bg-emerald-50/60 dark:bg-emerald-950/20 shadow-sm p-6 overflow-hidden"
      style={{ borderRadius: '24px 16px 20px 28px' }}>
      <svg className="absolute top-2 right-2 w-10 h-10 opacity-20 text-emerald-600 dark:text-emerald-400" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path d="M20 36 C20 36 8 28 8 18 C8 10 14 6 20 10 C26 6 32 10 32 18 C32 28 20 36 20 36Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15" />
        <path d="M20 10 L20 30" stroke="currentColor" strokeWidth="1" />
      </svg>
      <div className="relative z-10">
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-sm opacity-80" style={{ lineHeight: '1.85' }}>{text}</p>
      </div>
    </div>
  )
}

const cardComponents: Record<string, React.FC<{ title: string; text: string }>> = {
  baker: BakerCard,
  change: ChangeCard,
  code: CodeCard,
  work: WorkCard,
  side: SideCard,
  passion: PassionCard,
  life: LifeCard,
}

export default function ChapterCard({ chapterId, icon, title, text, isVisible }: ChapterCardProps) {
  const CardContent = cardComponents[chapterId]

  return (
    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
      }}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-500 mb-4 ${chapterId === 'passion' ? 'relative' : ''}`}>
        {chapterId === 'passion' && (
          <span className="absolute inset-0 rounded-xl border-2 border-orange-500/30"
            style={{ animation: 'gentle-pulse 2s ease-in-out infinite' }} />
        )}
        {icon}
      </div>

      {/* Styled card */}
      {CardContent ? (
        <CardContent title={title} text={text} />
      ) : (
        <div className="p-6 rounded-xl bg-gray-100/50 dark:bg-gray-800/50">
          <h3 className="text-xl font-bold mb-3">{title}</h3>
          <p className="text-sm leading-relaxed opacity-80">{text}</p>
        </div>
      )}
    </div>
  )
}
