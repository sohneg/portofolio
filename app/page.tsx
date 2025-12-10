import LanguageCycleText from '@/components/LanguageCycleText'

export const metadata = {
  title: 'My Portfolio',
  description: 'Certified developer for websites, apps, software and games – from baker to developer',
  openGraph: {
    title: 'My Portfolio',
    description: 'Certified developer for websites, apps, software and games – from baker to developer',
    images: ['/og-image.jpg'],
  },
}

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <LanguageCycleText />
      <p className="text-lg text-secondary max-w-xl text-center">
        I'm Simon Sohneg, a certified developer and former baker. Driven by curiosity 
        and a love for creating things, I turned my passion into a career. Now I build 
        websites, apps, software and games.
      </p>
    </main>
  )
}