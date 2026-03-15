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
  wobbleAmplitude?: number
  wobbleDamping?: number
  wobbleFrequency?: number
  wobbleRadius?: number
  wobbleSpread?: number
  gridSpacing?: number
  spotlightRadius?: number
}

const GRID_SPACING = 20
const SEGMENT_SIZE = 6
const MIN_AMPLITUDE = 0.1
const MAX_PLUCKS = 150

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
  wobbleAmplitude = 5,
  wobbleDamping = 3,
  wobbleFrequency = 8,
  wobbleRadius = 20,
  wobbleSpread = 1500,
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
  const prevMouseRef = useRef<{ x: number; y: number } | null>(null)
  const rainbowFieldRef = useRef<HTMLCanvasElement | null>(null)

  // Pre-compute displacement for a line, returns Float32Array of offsets
  const computeLineDisplacements = useCallback(
    (plucks: Pluck[], linePos: number, length: number, now: number): Float32Array | null => {
      // Collect only plucks for this line
      let hasPlucks = false
      for (let i = 0; i < plucks.length; i++) {
        if (plucks[i].linePos === linePos) { hasPlucks = true; break }
      }
      if (!hasPlucks) return null

      const count = Math.ceil(length / SEGMENT_SIZE) + 1
      const offsets = new Float32Array(count)

      for (let si = 0; si < count; si++) {
        const drawPos = si * SEGMENT_SIZE
        let total = 0
        for (let i = 0; i < plucks.length; i++) {
          const p = plucks[i]
          if (p.linePos !== linePos) continue
          const elapsed = (now - p.time) / 1000
          const amp = p.amplitude * Math.sin(wobbleFrequency * Math.PI * 2 * elapsed) * Math.exp(-wobbleDamping * elapsed)
          const dist = Math.abs(drawPos - p.hitPos)
          const spread = wobbleSpread * Math.max(elapsed, 0.05)
          total += amp * Math.exp(-((dist * dist) / (spread * spread)))
        }
        offsets[si] = total
      }

      return offsets
    },
    [wobbleDamping, wobbleFrequency, wobbleSpread],
  )

  // Prune dead plucks (batch, no splice in loop)
  const pruneDeadPlucks = useCallback((plucks: Pluck[], now: number) => {
    let writeIdx = 0
    for (let i = 0; i < plucks.length; i++) {
      const elapsed = (now - plucks[i].time) / 1000
      const amp = Math.abs(plucks[i].amplitude * Math.exp(-wobbleDamping * elapsed))
      if (amp >= MIN_AMPLITUDE) {
        plucks[writeIdx++] = plucks[i]
      }
    }
    plucks.length = writeIdx
  }, [wobbleDamping])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

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

    const createPlucksAt = (x: number, y: number, now: number) => {
      const hPlucks = hPlucksRef.current
      const startLine = Math.max(1, Math.floor((y - wobbleRadius) / gridSpacing))
      const endLine = Math.floor((y + wobbleRadius) / gridSpacing)
      for (let i = startLine; i <= endLine; i++) {
        const lineY = i * gridSpacing
        const dist = Math.abs(y - lineY)
        if (dist < wobbleRadius) {
          const strength = 1 - dist / wobbleRadius
          const already = hPlucks.some(
            (p) => p.linePos === lineY && Math.abs(p.hitPos - x) < gridSpacing && now - p.time < 200,
          )
          if (!already) {
            hPlucks.push({ linePos: lineY, hitPos: x, time: now, amplitude: wobbleAmplitude * strength })
          }
        }
      }

      const vPlucks = vPlucksRef.current
      const startCol = Math.max(1, Math.floor((x - wobbleRadius) / gridSpacing))
      const endCol = Math.floor((x + wobbleRadius) / gridSpacing)
      for (let i = startCol; i <= endCol; i++) {
        const lineX = i * gridSpacing
        const dist = Math.abs(x - lineX)
        if (dist < wobbleRadius) {
          const strength = 1 - dist / wobbleRadius
          const already = vPlucks.some(
            (p) => p.linePos === lineX && Math.abs(p.hitPos - y) < gridSpacing && now - p.time < 200,
          )
          if (!already) {
            vPlucks.push({ linePos: lineX, hitPos: y, time: now, amplitude: wobbleAmplitude * strength })
          }
        }
      }

      // Cap pluck count
      if (hPlucks.length > MAX_PLUCKS) hPlucks.splice(0, hPlucks.length - MAX_PLUCKS)
      if (vPlucks.length > MAX_PLUCKS) vPlucks.splice(0, vPlucks.length - MAX_PLUCKS)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      sizeRef.current.left = rect.left
      sizeRef.current.top = rect.top
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const now = performance.now()

      mouseRef.current = { x, y, active: true }

      const prev = prevMouseRef.current
      if (prev) {
        const dx = x - prev.x
        const dy = y - prev.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const steps = Math.max(1, Math.ceil(dist / (gridSpacing / 2)))
        for (let s = 1; s < steps; s++) {
          const t = s / steps
          createPlucksAt(prev.x + dx * t, prev.y + dy * t, now)
        }
      }

      createPlucksAt(x, y, now)
      prevMouseRef.current = { x, y }
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
      prevMouseRef.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    // Reusable path builder from cached offsets
    const drawPathFromOffsets = (
      target: CanvasRenderingContext2D,
      offsets: Float32Array | null,
      linePos: number,
      length: number,
      isHorizontal: boolean,
    ) => {
      target.beginPath()
      if (isHorizontal) {
        target.moveTo(0, linePos)
        if (offsets) {
          for (let si = 1; si < offsets.length; si++) {
            target.lineTo(si * SEGMENT_SIZE, linePos + offsets[si])
          }
        } else {
          target.lineTo(length, linePos)
        }
      } else {
        target.moveTo(linePos, 0)
        if (offsets) {
          for (let si = 1; si < offsets.length; si++) {
            target.lineTo(linePos + offsets[si], si * SEGMENT_SIZE)
          }
        } else {
          target.lineTo(linePos, length)
        }
      }
      target.stroke()
    }

    const draw = () => {
      const { w, h } = sizeRef.current
      const now = performance.now()
      const mouse = mouseRef.current

      // Prune dead plucks once per frame
      pruneDeadPlucks(hPlucksRef.current, now)
      pruneDeadPlucks(vPlucksRef.current, now)

      ctx.clearRect(0, 0, w, h)

      const hLines = Math.floor(h / gridSpacing)
      const vLines = Math.floor(w / gridSpacing)

      // Pre-compute all displacements once
      const hOffsets: (Float32Array | null)[] = new Array(hLines + 1)
      for (let i = 1; i <= hLines; i++) {
        hOffsets[i] = computeLineDisplacements(hPlucksRef.current, i * gridSpacing, w, now)
      }
      const vOffsets: (Float32Array | null)[] = new Array(vLines + 1)
      for (let i = 1; i <= vLines; i++) {
        vOffsets[i] = computeLineDisplacements(vPlucksRef.current, i * gridSpacing, h, now)
      }

      // 1) Base grid
      ctx.strokeStyle = gridColorRef.current
      ctx.lineWidth = 1
      for (let i = 1; i <= hLines; i++) {
        drawPathFromOffsets(ctx, hOffsets[i], i * gridSpacing, w, true)
      }
      for (let i = 1; i <= vLines; i++) {
        drawPathFromOffsets(ctx, vOffsets[i], i * gridSpacing, h, false)
      }

      // 2) Rainbow spotlight - only lines near mouse
      if (mouse.active && rainbowFieldRef.current) {
        const sr = spotlightRadius
        const pattern = ctx.createPattern(rainbowFieldRef.current, 'no-repeat')
        if (pattern) {
          ctx.save()
          ctx.beginPath()
          ctx.arc(mouse.x, mouse.y, sr, 0, Math.PI * 2)
          ctx.clip()

          ctx.strokeStyle = pattern

          // Glow
          ctx.lineWidth = 2
          ctx.shadowBlur = 6
          ctx.shadowColor = 'rgba(255,255,255,0.3)'
          ctx.globalAlpha = 0.35

          // Only draw lines within spotlight range
          const hMin = Math.max(1, Math.floor((mouse.y - sr) / gridSpacing))
          const hMax = Math.min(hLines, Math.ceil((mouse.y + sr) / gridSpacing))
          for (let i = hMin; i <= hMax; i++) {
            drawPathFromOffsets(ctx, hOffsets[i], i * gridSpacing, w, true)
          }
          const vMin = Math.max(1, Math.floor((mouse.x - sr) / gridSpacing))
          const vMax = Math.min(vLines, Math.ceil((mouse.x + sr) / gridSpacing))
          for (let i = vMin; i <= vMax; i++) {
            drawPathFromOffsets(ctx, vOffsets[i], i * gridSpacing, h, false)
          }

          // Sharp
          ctx.shadowBlur = 0
          ctx.lineWidth = 1
          ctx.globalAlpha = 0.5
          for (let i = hMin; i <= hMax; i++) {
            drawPathFromOffsets(ctx, hOffsets[i], i * gridSpacing, w, true)
          }
          for (let i = vMin; i <= vMax; i++) {
            drawPathFromOffsets(ctx, vOffsets[i], i * gridSpacing, h, false)
          }

          ctx.restore()
        }
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
  }, [wobbleAmplitude, wobbleRadius, gridSpacing, spotlightRadius, computeLineDisplacements, pruneDeadPlucks])

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
