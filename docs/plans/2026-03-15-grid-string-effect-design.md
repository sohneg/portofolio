# Grid String Effect Design

## Summary
Replace the CSS gradient grid in `GridBackground.tsx` with a canvas-based grid where lines behave like guitar strings - vibrating when the mouse passes near them.

## Approach: Canvas with Damped Oscillator Physics

### What changes
- **Replace**: CSS `repeating-linear-gradient` grid → `<canvas>` drawing individual lines
- **Keep**: SVG dissolve filter (applied via CSS on canvas), rainbow spotlight, mask, all existing props
- **Add**: Mouse trail tracking, pluck physics system, `requestAnimationFrame` loop

### Physics Model
Each "pluck" is a damped harmonic oscillator:
```
displacement = amplitude * sin(frequency * elapsed) * exp(-damping * elapsed) * spatialFalloff(distanceAlongLine)
```

Spatial falloff uses a Gaussian: `exp(-(dist / spread)^2)` so the wave is strongest at the pluck point and fades along the line.

### New Configurable Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pluckAmplitude` | number | 6 | Max displacement in px |
| `pluckDamping` | number | 3 | How fast vibration decays |
| `pluckFrequency` | number | 8 | Oscillation frequency |
| `pluckRadius` | number | 80 | Mouse proximity trigger radius |
| `propagationSpeed` | number | 200 | Wave spread along line (px) |

### Data Flow
1. `mousemove` → append to trail buffer (last ~30 positions + timestamps)
2. Each `requestAnimationFrame`: for each line, check proximity to trail points
3. Close enough → create pluck `{lineIndex, position, time, amplitude, isHorizontal}`
4. Draw each line as segmented path with summed displacement from all active plucks
5. Remove expired plucks (amplitude < 0.1px)

### Consumers
- `app/[locale]/page.tsx` — `<GridBackground filterId="dissolve-home" />`
- `app/[locale]/about/page.tsx` — `<GridBackground filterId="dissolve-about" ... />`

Both pass no pluck props → use defaults. Can be customized per-page later.
