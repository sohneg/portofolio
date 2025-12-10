'use client'

import { useState } from 'react'

interface ThoughtBubbleProps {
  children: React.ReactNode
  text: string
}

export default function ThoughtBubble({ children, text }: ThoughtBubbleProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      {/* Thought bubble container */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 ml-6 z-[100] pointer-events-none">
        <div className="relative">
          {/* Cloud with delayed appearance */}
          <div
            className={`-ml-3 transition-all duration-300 ease-out
              ${isVisible ? 'opacity-100 scale-100 animate-float-wave' : 'opacity-0 scale-90'}`}
            style={{
              transitionDelay: isVisible ? '400ms' : '0ms',
              animationDelay: '450ms'
            }}
          >
            <svg
              viewBox="0 0 200 90"
              className="w-72 h-32 drop-shadow-xl"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <filter id="cloud-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
                </filter>
              </defs>
              <path
                d="M 25,55
                   C 10,55 5,45 15,35
                   C 10,20 30,10 45,20
                   C 55,5 85,0 100,15
                   C 115,0 145,5 155,20
                   C 170,10 190,20 185,35
                   C 195,45 190,55 175,55
                   C 180,70 165,80 145,75
                   C 130,85 100,85 85,80
                   C 70,85 40,85 30,75
                   C 15,80 5,70 25,55 Z"
                style={{ fill: 'var(--foreground)' }}
                filter="url(#cloud-shadow)"
              />
            </svg>

            {/* Text */}
            <div className="absolute inset-0 flex items-center justify-center px-12 pt-1">
              <p className="text-sm italic text-center leading-snug" style={{ color: 'var(--background)' }}>
                &ldquo;{text}&rdquo;
              </p>
            </div>
          </div>

          {/* Thought bubbles - animated sequentially with wave float */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 flex flex-row-reverse items-center gap-0.5 -mr-4 -z-10">
            {/* Large dot (near cloud) - appears third */}
            <div
              className={`w-5 h-5 rounded-full shadow-lg
                transition-all duration-200 ease-out
                ${isVisible ? 'opacity-100 scale-100 animate-float-wave' : 'opacity-0 scale-0'}`}
              style={{
                backgroundColor: 'var(--foreground)',
                transitionDelay: isVisible ? '250ms' : '0ms',
                animationDelay: '300ms'
              }}
            />
            {/* Medium dot - appears second */}
            <div
              className={`w-3.5 h-3.5 rounded-full shadow-md
                transition-all duration-200 ease-out
                ${isVisible ? 'opacity-100 scale-100 animate-float-wave' : 'opacity-0 scale-0'}`}
              style={{
                backgroundColor: 'var(--foreground)',
                transitionDelay: isVisible ? '120ms' : '0ms',
                animationDelay: '150ms'
              }}
            />
            {/* Small dot (near orange) - appears first */}
            <div
              className={`w-2 h-2 rounded-full shadow
                transition-all duration-200 ease-out
                ${isVisible ? 'opacity-100 scale-100 animate-float-wave' : 'opacity-0 scale-0'}`}
              style={{
                backgroundColor: 'var(--foreground)',
                transitionDelay: isVisible ? '0ms' : '0ms',
                animationDelay: '0ms'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
