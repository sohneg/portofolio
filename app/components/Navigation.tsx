'use client'

import { Link, usePathname, useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'
import { Home, User, Briefcase, Mail, Sun, Moon, Globe } from 'lucide-react'

const navItems = [
  { href: '/' as const, icon: <Home /> },
  { href: '/about' as const, icon: <User /> },
  { href: '/projects' as const, icon: <Briefcase /> },
  { href: '/contact' as const, icon: <Mail /> },
]

export default function Navigation() {
  const pathname = usePathname()
  const locale = useLocale()
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()

  const activeIndex = navItems.findIndex(item => item.href === pathname)
  const [prevIndex, setPrevIndex] = useState(activeIndex)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (activeIndex !== prevIndex) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setPrevIndex(activeIndex)
        setIsAnimating(false)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [activeIndex, prevIndex])

  const toggleLocale = () => {
    const newLocale = locale === 'en' ? 'de' : 'en'
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <>
      {/* SVG Filter for gooey effect */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Desktop: Links fixiert */}
      <nav className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col bg-nav p-2 rounded-full z-50">
        <div className="relative flex flex-col gap-2">
          {/* Gooey container */}
          <div className="absolute inset-0 pointer-events-none" style={{ filter: 'url(#goo)' }}>
            {/* Current position indicator */}
            {activeIndex !== -1 && (
              <div
                className="absolute w-12 h-12 bg-orange-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  top: `${activeIndex * 56}px`,
                }}
              />
            )}
            {/* Hover blob - small chunk that gets pulled towards hovered item */}
            {activeIndex !== -1 && (
              <div
                className={`absolute w-5 h-5 bg-orange-500 rounded-full
                  ${hoveredIndex !== null && hoveredIndex !== activeIndex
                    ? ''
                    : 'transition-all duration-300'}`}
                style={{
                  left: '14px',
                  top: `${activeIndex * 56 + 14 + (hoveredIndex !== null && hoveredIndex !== activeIndex
                    ? (hoveredIndex > activeIndex ? 20 : -20)
                    : 0)}px`,
                  opacity: hoveredIndex !== null && hoveredIndex !== activeIndex ? 1 : 0,
                  animation: hoveredIndex !== null && hoveredIndex !== activeIndex
                    ? `${hoveredIndex > activeIndex ? 'blob-struggle-down' : 'blob-struggle-up'} 0.6s ease-in-out infinite`
                    : 'none',
                }}
              />
            )}
            {/* Previous position blob for metaball stretch */}
            {isAnimating && prevIndex !== -1 && (
              <div
                className="absolute w-12 h-12 bg-orange-500 rounded-full transition-all duration-200"
                style={{
                  top: `${prevIndex * 56}px`,
                  opacity: 1,
                  transform: 'scale(0.7)',
                }}
              />
            )}
          </div>

          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300
                ${pathname === item.href
                  ? 'text-white'
                  : 'hover:bg-nav-hover text-secondary'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <button
            onClick={toggleLocale}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-nav-hover cursor-pointer text-secondary transition-all text-sm font-medium"
          >
            {locale.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-nav-hover cursor-pointer text-secondary transition-all"
          >
            <span className="text-xl">{theme === 'dark' ? <Sun /> : <Moon />}</span>
          </button>
        </div>
      </nav>

      {/* Mobile: Unten fixiert */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex bg-nav p-2 rounded-full z-50">
        <div className="relative flex gap-2">
          {/* Gooey container */}
          <div className="absolute inset-0 pointer-events-none" style={{ filter: 'url(#goo)' }}>
            {/* Current position indicator */}
            {activeIndex !== -1 && (
              <div
                className="absolute w-12 h-12 bg-orange-500 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{
                  left: `${activeIndex * 56}px`,
                }}
              />
            )}
            {/* Hover blob - small chunk that gets pulled towards hovered item */}
            {activeIndex !== -1 && (
              <div
                className={`absolute w-5 h-5 bg-orange-500 rounded-full
                  ${hoveredIndex !== null && hoveredIndex !== activeIndex
                    ? ''
                    : 'transition-all duration-300'}`}
                style={{
                  top: '14px',
                  left: `${activeIndex * 56 + 14 + (hoveredIndex !== null && hoveredIndex !== activeIndex
                    ? (hoveredIndex > activeIndex ? 20 : -20)
                    : 0)}px`,
                  opacity: hoveredIndex !== null && hoveredIndex !== activeIndex ? 1 : 0,
                  animation: hoveredIndex !== null && hoveredIndex !== activeIndex
                    ? `${hoveredIndex > activeIndex ? 'blob-struggle-right' : 'blob-struggle-left'} 0.6s ease-in-out infinite`
                    : 'none',
                }}
              />
            )}
            {/* Previous position blob for metaball stretch */}
            {isAnimating && prevIndex !== -1 && (
              <div
                className="absolute w-12 h-12 bg-orange-500 rounded-full transition-all duration-200"
                style={{
                  left: `${prevIndex * 56}px`,
                  opacity: 1,
                  transform: 'scale(0.7)',
                }}
              />
            )}
          </div>

          {navItems.map((item, index) => (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`relative z-10 w-12 h-12 flex items-center justify-center rounded-full transition-colors duration-300
                ${pathname === item.href
                  ? 'text-white'
                  : 'hover:bg-nav-hover text-secondary'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
            </Link>
          ))}
        </div>

        <div className="flex gap-2 ml-2">
          <button
            onClick={toggleLocale}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-nav-hover cursor-pointer text-secondary transition-all text-sm font-medium"
          >
            {locale.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-nav-hover cursor-pointer text-secondary transition-all"
          >
            <span className="text-xl">{theme === 'dark' ? <Sun /> : <Moon />}</span>
          </button>
        </div>
      </nav>
    </>
  )
}
