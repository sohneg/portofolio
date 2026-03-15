'use client'

import { useEffect, useRef, useCallback } from 'react'

interface Pluck {
  linePos: number
  hitPos: number
  time: number
  amplitude: number
}

interface GridBackgroundProps {
  filterId: string
  filterSeed?: number
  filterFrequency?: number
  filterSlope?: number
  filterIntercept?: number
  fixed?: boolean
  maskImage?: string
  style?: React.CSSProperties
  pluckAmplitude?: number
  pluckDamping?: number
  pluckFrequency?: number
  pluckRadius?: number
  propagationSpeed?: number
  gridSpacing?: number
  spotlightRadius?: number
}

const GRID_SPACING = 20
const SEGMENT_SIZE = 4
const MIN_AMPLITUDE = 0.1

const RAINBOW_SPOTS = [
  { px: 0.10, py: 0.20, radius: 400, r: 255, g: 23,  b: 68,  a: 0.8, fade: 0.7 },
  { px: 0.90, py: 0.10, radius: 300, r: 0,   g: 229, b: 255, a: 0.7, fade: 0.7 },
  { px: 0.60, py: 0.90, radius: 500, r: 0,   g: 230, b: 118, a: 0.7, fade: 0.7 },
  { px: 0.30, py: 0.60, radius: 250, r: 255, g: 234, b: 0,   a: 0.6, fade: 0.6 },
  { px: 0.80, py: 0.55, radius: 350, r: 213, g: 0,   b: 249, a: 0.7, fade: 0.7 },
  { px: 0.05, py: 0.85, radius: 450, r: 41,  g: 121, b: 255, a: 0.8, fade: 0.7 },
  { px: 0.50, py: 0.30, radius: 300, r: 255, g: 145, b: 0,   a: 0.6, fade: 0.6 },
  { px: 0.70, py: 0.15, radius: 200, r: 255, g: 23,  b: 68,  a: 0.5, fade: 0.65 },
  { px: 0.40, py: 0.45, radius: 350, r: 0,   g: 229, b: 255, a: 0.4, fade: 0.7 },
  { px: 0.20, py: 0.95, radius: 280, r: 213, g: 0,   b: 249, a: 0.5, fade: 0.65 },
  { px: 0.95, py: 0.80, radius: 320, r: 0,   g: 230, b: 118, a: 0.6, fade: 0.7 },
]

export default function GridBackground({
  filterId,
  filterSeed = 123,
  filterFrequency = 0.012,
  filterSlope = 2,
  filterIntercept = -0.5,
  fixed = false,
  maskImage = 'radial-gradient(ellipse at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, transparent 70%)',
  style = {},
  pluckAmplitude = 15,
  pluckDamping = 2,
  pluckFrequency = 6,
  pluckRadius = 120,
  propagationSpeed = 300,
  gridSpacing = GRID_SPACING,
  spotlightRadius = 200,
}: GridBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hPlucksRef = useRef<Pluck[]>([])
  const vPlucksRef = useRef<Pluck[]>([])
  const rafRef = useRef<number>(0)
  const gridColorRef = useRef('rgba(128,128,128,0.25)')
  const sizeRef = useRef({ w: 0, h: 0, left: 0, top: 0 })
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const rainbowFieldRef = useRef<HTMLCanvasElement | null>(null)

  const getDisplacement = useCallback(
    (plucks: Pluck[], linePos: number, drawPos: number, now: number) => {
      let total = 0
      for (let i = plucks.length - 1; i >= 0; i--) {
        const p = plucks[i]
        if (p.linePos !== linePos) continue
        const elapsed = (now - p.time) / 1000
        const amp = p.amplitude * Math.sin(pluckFrequency * Math.PI * 2 * elapsed) * Math.exp(-pluckDamping * elapsed)
        if (Math.abs(amp) < MIN_AMPLITUDE) {
          plucks.splice(i, 1)
          continue
        }
        const dist = Math.abs(drawPos - p.hitPos)
        const spread = propagationSpeed * Math.max(elapsed, 0.05)
        const spatial = Math.exp(-((dist * dist) / (spread * spread)))
        total += amp * spatial
      }
      return total
    },
    [pluckDamping, pluckFrequency, propagationSpeed],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Pre-render rainbow color field
    const buildRainbowField = (w: number, h: number) => {
      const fc = document.createElement('canvas')
      fc.width = Math.ceil(w)
      fc.height = Math.ceil(h)
      const fctx = fc.getContext('2d')
      if (!fctx) return fc
      for (const spot of RAINBOW_SPOTS) {
        const cx = spot.px * w
        const cy = spot.py * h
        const grad = fctx.createRadialGradient(cx, cy, 0, cx, cy, spot.radius)
        grad.addColorStop(0, `rgba(${spot.r},${spot.g},${spot.b},${spot.a})`)
        grad.addColorStop(spot.fade, `rgba(${spot.r},${spot.g},${spot.b},${spot.a * 0.3})`)
        grad.addColorStop(1, `rgba(${spot.r},${spot.g},${spot.b},0)`)
        fctx.fillStyle = grad
        fctx.fillRect(0, 0, w, h)
      }
      return fc
    }

    const updateColor = () => {
      const temp = document.createElement('div')
      temp.style.color = 'var(--text-secondary)'
      document.body.appendChild(temp)
      const computed = getComputedStyle(temp).color
      document.body.removeChild(temp)
      const match = computed.match(/\d+/g)
      if (match) {
        gridColorRef.current = `rgba(${match[0]},${match[1]},${match[2]},0.25)`
      }
    }
    updateColor()

    const themeObserver = new MutationObserver(updateColor)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height, left: rect.left, top: rect.top }
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      rainbowFieldRef.current = buildRainbowField(rect.width, rect.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top } = sizeRef.current
      const x = e.clientX - left
      const y = e.clientY - top
      const now = performance.now()

      mouseRef.current = { x, y, active: true }

      const hPlucks = hPlucksRef.current
      const startLine = Math.max(1, Math.floor((y - pluckRadius) / gridSpacing))
      const endLine = Math.floor((y + pluckRadius) / gridSpacing)
      for (let i = startLine; i <= endLine; i++) {
        const lineY = i * gridSpacing
        const dist = Math.abs(y - lineY)
        if (dist < pluckRadius) {
          const strength = 1 - dist / pluckRadius
          const already = hPlucks.some(
            (p) => p.linePos === lineY && Math.abs(p.hitPos - x) < gridSpacing && now - p.time < 200,
          )
          if (!already) {
            hPlucks.push({ linePos: lineY, hitPos: x, time: now, amplitude: pluckAmplitude * strength })
          }
        }
      }

      const vPlucks = vPlucksRef.current
      const startCol = Math.max(1, Math.floor((x - pluckRadius) / gridSpacing))
      const endCol = Math.floor((x + pluckRadius) / gridSpacing)
      for (let i = startCol; i <= endCol; i++) {
        const lineX = i * gridSpacing
        const dist = Math.abs(x - lineX)
        if (dist < pluckRadius) {
          const strength = 1 - dist / pluckRadius
          const already = vPlucks.some(
            (p) => p.linePos === lineX && Math.abs(p.hitPos - y) < gridSpacing && now - p.time < 200,
          )
          if (!already) {
            vPlucks.push({ linePos: lineX, hitPos: y, time: now, amplitude: pluckAmplitude * strength })
          }
        }
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    const drawDisplacedLines = (
      target: CanvasRenderingContext2D,
      w: number, h: number, now: number,
    ) => {
      const hLines = Math.floor(h / gridSpacing)
      for (let i = 1; i <= hLines; i++) {
        const lineY = i * gridSpacing
        target.beginPath()
        target.moveTo(0, lineY)
        for (let x = SEGMENT_SIZE; x <= w; x += SEGMENT_SIZE) {
          const dy = getDisplacement(hPlucksRef.current, lineY, x, now)
          target.lineTo(x, lineY + dy)
        }
        target.stroke()
      }

      const vLines = Math.floor(w / gridSpacing)
      for (let i = 1; i <= vLines; i++) {
        const lineX = i * gridSpacing
        target.beginPath()
        target.moveTo(lineX, 0)
        for (let y = SEGMENT_SIZE; y <= h; y += SEGMENT_SIZE) {
          const dx = getDisplacement(vPlucksRef.current, lineX, y, now)
          target.lineTo(lineX + dx, y)
        }
        target.stroke()
      }
    }

    const draw = () => {
      const { w, h } = sizeRef.current
      const now = performance.now()
      const mouse = mouseRef.current

      ctx.clearRect(0, 0, w, h)

      // 1) Base grid (gray lines with displacement)
      ctx.strokeStyle = gridColorRef.current
      ctx.lineWidth = 1
      drawDisplacedLines(ctx, w, h, now)

      // 2) Rainbow spotlight (colored lines with same displacement, clipped to mouse circle)
      if (mouse.active && rainbowFieldRef.current) {
        const sr = spotlightRadius

        ctx.save()

        // Clip to circular spotlight around mouse
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, sr, 0, Math.PI * 2)
        ctx.clip()

        // Use rainbow field as pattern for stroke
        const pattern = ctx.createPattern(rainbowFieldRef.current, 'no-repeat')
        if (pattern) {
          // Glow pass
          ctx.strokeStyle = pattern
          ctx.lineWidth = 2
          ctx.shadowBlur = 6
          ctx.shadowColor = 'rgba(255,255,255,0.3)'
          ctx.globalAlpha = 0.35
          drawDisplacedLines(ctx, w, h, now)

          // Sharp pass
          ctx.shadowBlur = 0
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.5
          drawDisplacedLines(ctx, w, h, now)
        }

        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      themeObserver.disconnect()
    }
  }, [pluckAmplitude, pluckRadius, gridSpacing, spotlightRadius, getDisplacement])

  const positionClass = fixed ? 'fixed' : 'absolute'

  return (
    <>
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={filterId}>
            <feTurbulence type="fractalNoise" baseFrequency={filterFrequency} numOctaves={3} seed={filterSeed} result="noise" />
            <feComponentTransfer in="noise" result="fade">
              <feFuncA type="linear" slope={filterSlope} intercept={filterIntercept} />
            </feComponentTransfer>
            <feComposite in="SourceGraphic" in2="fade" operator="in" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        className={`${positionClass} inset-0 w-full h-full pointer-events-none`}
        style={{
          filter: `url(#${filterId})`,
          maskImage,
          WebkitMaskImage: maskImage,
          ...style,
        }}
      />
    </>
  )
}
