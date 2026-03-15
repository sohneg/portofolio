'use client'

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useTheme } from './ThemeProvider'

export interface PageAtmosphereHandle {
  update: (activeSection: string, nextSection: string, transitionProgress: number) => void
}

interface Atmosphere {
  bg: string
  text: string
  scanlines: boolean
  noise: boolean
  noiseColor: string
  vignette: boolean
  vignetteColor: string
  fontFamily: string  // '' | 'mono' | 'serif'
}

// Dark mode atmospheres
const darkAtmospheres: Record<string, Atmosphere> = {
  default: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  baker: {
    bg: '#2a1f14', text: '#e8d5b8',
    scanlines: false, noise: true, noiseColor: 'rgba(200,170,120,0.04)',
    vignette: true, vignetteColor: 'rgba(20,12,5,0.5)', fontFamily: 'serif',
  },
  change: {
    bg: '#1a1520', text: '#d4c8e0',
    scanlines: false, noise: true, noiseColor: 'rgba(150,100,200,0.03)',
    vignette: true, vignetteColor: 'rgba(10,5,20,0.6)', fontFamily: '',
  },
  code: {
    bg: '#0a0a0a', text: '#00ff41',
    scanlines: true, noise: false, noiseColor: '',
    vignette: true, vignetteColor: 'rgba(0,0,0,0.7)', fontFamily: 'mono',
  },
  work: {
    bg: '#0f1419', text: '#e2e8f0',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  tuning: {
    bg: '#1a0a0a', text: '#f0c0c0',
    scanlines: false, noise: true, noiseColor: 'rgba(200,50,50,0.03)',
    vignette: true, vignetteColor: 'rgba(20,5,5,0.5)', fontFamily: '',
  },
  dice: {
    bg: '#1a0f20', text: '#d4b8e8',
    scanlines: false, noise: true, noiseColor: 'rgba(150,80,200,0.03)',
    vignette: true, vignetteColor: 'rgba(15,5,25,0.5)', fontFamily: '',
  },
  infra: {
    bg: '#0a1628', text: '#bfdbfe',
    scanlines: false, noise: true, noiseColor: 'rgba(59,130,246,0.02)',
    vignette: true, vignetteColor: 'rgba(5,10,30,0.5)', fontFamily: '',
  },
  life: {
    bg: '#0b1a12', text: '#d1fae5',
    scanlines: false, noise: true, noiseColor: 'rgba(16,185,129,0.02)',
    vignette: true, vignetteColor: 'rgba(5,15,10,0.4)', fontFamily: '',
  },
}

// Light mode atmospheres
const lightAtmospheres: Record<string, Atmosphere> = {
  default: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  baker: {
    bg: '#fdf6e8', text: '#4a3520',
    scanlines: false, noise: true, noiseColor: 'rgba(180,140,80,0.05)',
    vignette: true, vignetteColor: 'rgba(200,170,120,0.2)', fontFamily: 'serif',
  },
  change: {
    bg: '#f0ecf5', text: '#3a2850',
    scanlines: false, noise: true, noiseColor: 'rgba(130,90,180,0.03)',
    vignette: true, vignetteColor: 'rgba(100,70,150,0.1)', fontFamily: '',
  },
  code: {
    bg: '#0a0a0a', text: '#00ff41',  // Terminal is ALWAYS dark - that's the point
    scanlines: true, noise: false, noiseColor: '',
    vignette: true, vignetteColor: 'rgba(0,0,0,0.7)', fontFamily: 'mono',
  },
  work: {
    bg: '#f1f5f9', text: '#1e293b',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  tuning: {
    bg: '#fef2f2', text: '#7f1d1d',
    scanlines: false, noise: true, noiseColor: 'rgba(200,50,50,0.03)',
    vignette: true, vignetteColor: 'rgba(200,50,50,0.08)', fontFamily: '',
  },
  dice: {
    bg: '#f5f0ff', text: '#3b1f6e',
    scanlines: false, noise: true, noiseColor: 'rgba(130,80,200,0.03)',
    vignette: true, vignetteColor: 'rgba(130,80,200,0.08)', fontFamily: '',
  },
  infra: {
    bg: '#eff6ff', text: '#1e3a5f',
    scanlines: false, noise: true, noiseColor: 'rgba(59,130,246,0.03)',
    vignette: true, vignetteColor: 'rgba(59,130,246,0.08)', fontFamily: '',
  },
  life: {
    bg: '#ecfdf5', text: '#064e3b',
    scanlines: false, noise: true, noiseColor: 'rgba(16,185,129,0.03)',
    vignette: true, vignetteColor: 'rgba(16,185,129,0.08)', fontFamily: '',
  },
}

function lerpColor(a: string, b: string, t: number): string {
  const parse = (c: string) => {
    if (c.startsWith('#') && c.length === 7) {
      return [
        parseInt(c.slice(1, 3), 16),
        parseInt(c.slice(3, 5), 16),
        parseInt(c.slice(5, 7), 16),
      ]
    }
    return null
  }
  const ca = parse(a)
  const cb = parse(b)
  if (!ca || !cb) return t < 0.5 ? a : b
  const r = Math.round(ca[0] + (cb[0] - ca[0]) * t)
  const g = Math.round(ca[1] + (cb[1] - ca[1]) * t)
  const bl = Math.round(ca[2] + (cb[2] - ca[2]) * t)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

interface PageAtmosphereProps {
  activeSection: string
  transitionProgress: number
  nextSection: string
}

export default forwardRef<PageAtmosphereHandle, PageAtmosphereProps>(function PageAtmosphere(
  { activeSection: initialActive, transitionProgress: initialProgress, nextSection: initialNext },
  ref,
) {
  const { theme } = useTheme()
  // Refs for direct DOM manipulation - no re-renders on scroll
  const containerRef = useRef<HTMLDivElement>(null)
  const scanlinesRef = useRef<HTMLDivElement>(null)
  const noiseRef = useRef<HTMLDivElement>(null)
  const vignetteRef = useRef<HTMLDivElement>(null)
  const crtCurvatureRef = useRef<HTMLDivElement>(null)
  const mainElRef = useRef<HTMLElement | null>(null)

  // Cache last computed values to skip redundant DOM writes
  const lastValuesRef = useRef({ activeSection: '', nextSection: '', transitionProgress: -1, theme: '' })

  const applyAtmosphere = useCallback((activeSection: string, nextSection: string, transitionProgress: number) => {
    const currentTheme = theme
    const last = lastValuesRef.current
    // Skip if nothing changed
    if (
      last.activeSection === activeSection &&
      last.nextSection === nextSection &&
      last.transitionProgress === transitionProgress &&
      last.theme === currentTheme
    ) return
    last.activeSection = activeSection
    last.nextSection = nextSection
    last.transitionProgress = transitionProgress
    last.theme = currentTheme

    const atmos = currentTheme === 'dark' ? darkAtmospheres : lightAtmospheres
    const current = atmos[activeSection] || atmos.default
    const next = atmos[nextSection] || atmos.default
    const t = smoothstep(Math.max(0, Math.min(1, transitionProgress)))

    // Interpolate values
    const bg = current.bg && next.bg
      ? lerpColor(current.bg, next.bg, t)
      : t > 0.5 ? next.bg : current.bg
    const showScanlines = t > 0.5 ? next.scanlines : current.scanlines
    const showNoise = t > 0.3 ? next.noise : current.noise
    const noiseColor = t > 0.5 ? next.noiseColor : current.noiseColor
    const showVignette = current.vignette || next.vignette
    const vignetteColor = t > 0.5 ? next.vignetteColor : current.vignetteColor

    // Apply background to main element
    if (!mainElRef.current) {
      mainElRef.current = document.querySelector('[data-about-page]') as HTMLElement
    }
    if (mainElRef.current) {
      mainElRef.current.style.backgroundColor = bg || ''
    }

    // Scanlines
    if (scanlinesRef.current) {
      if (showScanlines) {
        scanlinesRef.current.style.display = ''
        scanlinesRef.current.style.opacity = String(t > 0.5 ? 1 : t * 2)
      } else {
        scanlinesRef.current.style.display = 'none'
      }
    }

    // Noise
    if (noiseRef.current) {
      if (showNoise && noiseColor) {
        noiseRef.current.style.display = ''
      } else {
        noiseRef.current.style.display = 'none'
      }
    }

    // Vignette
    if (vignetteRef.current) {
      if (showVignette && vignetteColor) {
        vignetteRef.current.style.display = ''
        vignetteRef.current.style.background = `radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, ${vignetteColor} 100%)`
      } else {
        vignetteRef.current.style.display = 'none'
      }
    }

    // CRT curvature
    if (crtCurvatureRef.current) {
      if (showScanlines) {
        crtCurvatureRef.current.style.display = ''
        crtCurvatureRef.current.style.opacity = String(t > 0.5 ? 1 : t * 2)
      } else {
        crtCurvatureRef.current.style.display = 'none'
      }
    }
  }, [theme])

  // Expose imperative update method
  useImperativeHandle(ref, () => ({
    update: applyAtmosphere,
  }), [applyAtmosphere])

  // Apply initial state
  useEffect(() => {
    applyAtmosphere(initialActive, initialNext, initialProgress)
    return () => {
      if (mainElRef.current) {
        mainElRef.current.style.backgroundColor = ''
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-[0]" aria-hidden="true">
      {/* CRT Scanlines - always rendered, toggled via display */}
      <div
        ref={scanlinesRef}
        className="absolute inset-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(0,255,65,0.03) 1px, rgba(0,255,65,0.03) 2px)',
          display: 'none',
        }}
      />

      {/* Noise / paper texture */}
      <div
        ref={noiseRef}
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.5,
          display: 'none',
        }}
      />

      {/* Vignette */}
      <div
        ref={vignetteRef}
        className="absolute inset-0"
        style={{ display: 'none' }}
      />

      {/* CRT screen curvature */}
      <div
        ref={crtCurvatureRef}
        className="absolute inset-0"
        style={{
          boxShadow: 'inset 0 0 120px rgba(0,0,0,0.7)',
          borderRadius: '8px',
          display: 'none',
        }}
      />
    </div>
  )
})
