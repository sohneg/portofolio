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
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  code: {
    bg: '#0a0a0a', text: '#00ff41',
    scanlines: true, noise: false, noiseColor: '',
    vignette: true, vignetteColor: 'rgba(0,0,0,0.7)', fontFamily: 'mono',
  },
  work: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  tuning: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  dice: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  infra: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  life: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
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
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  code: {
    bg: '#0a0a0a', text: '#00ff41',
    scanlines: true, noise: false, noiseColor: '',
    vignette: true, vignetteColor: 'rgba(0,0,0,0.7)', fontFamily: 'mono',
  },
  work: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  tuning: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  dice: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  infra: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
  },
  life: {
    bg: '', text: '',
    scanlines: false, noise: false, noiseColor: '',
    vignette: false, vignetteColor: '', fontFamily: '',
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
