'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useTheme } from './ThemeProvider'
import { useEffect, useState } from 'react'
import { Home, User, Briefcase, Mail, Sun, Moon } from 'lucide-react'

const navItems = [
  { href: '/', icon: <Home />, label: 'Home' },
  { href: '/about', icon: <User />, label: 'About' },
  { href: '/projects', icon: <Briefcase />, label: 'Projects' },
  { href: '/contact', icon: <Mail />, label: 'Contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { theme, toggleTheme } = useTheme()

  const activeIndex = navItems.findIndex(item => item.href === pathname)
  const [prevIndex, setPrevIndex] = useState(activeIndex)
  const [isAnimating, setIsAnimating] = useState(false)

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
      <nav className="hidden md:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col bg-nav p-2 rounded-full">
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

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
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

        <button
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-nav-hover cursor-pointer text-secondary transition-all mt-2"
        >
          <span className="text-xl">{theme === 'dark' ? <Sun /> : <Moon />}</span>
        </button>
      </nav>

      {/* Mobile: Unten fixiert */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 flex bg-nav p-2 rounded-full">
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

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
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

        <button
          onClick={toggleTheme}
          className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-nav-hover cursor-pointer text-secondary transition-all ml-2"
        >
          <span className="text-xl">{theme === 'dark' ? <Sun /> : <Moon />}</span>
        </button>
      </nav>
    </>
  )
}