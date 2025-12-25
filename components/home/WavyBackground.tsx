'use client'

import { useEffect, useRef, useState } from 'react'
import { createNoise2D } from 'simplex-noise'
import clsx from 'clsx'

type WavyBackgroundProps = {
  colors?: string[]
  speed?: number
  blur?: number
  opacity?: number
  amplitude?: number
  frequency?: number
  colorDrift?: number
  structureJitter?: number
  centerDrift?: number
  thickness?: number
  thicknessVariation?: number
  className?: string
}

// Update this palette to change the default gradient spectrum
const DEFAULT_COLORS = ['#80efff','#031327', '#4060ff', '#80efff', '#0B0F19', '#3192ff', '#80efff', '#5d82ff', '#4060ff', '#031327']

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))

type LayerOrientation = 'top' | 'center' | 'bottom'

type LayerConfig = {
  baseHeight: number
  amplitudeScale: number
  frequencyScale: number
  opacityScale: number
  speedScale: number
  orientation: LayerOrientation
  thicknessScale?: number
}

export function WavyBackground({
  // colors: gradient stops, slow transitions happen automatically
  colors = DEFAULT_COLORS,
  // speed: advance rate for the noise field (0.0002 – 0.01 recommended; higher = faster overall motion)
  speed = 10,
  // blur: gaussian blur applied to soften banding (0 – 40; higher = softer blend/lower detail)
  blur = 25,
  // opacity: global alpha per layer, keep < 1 for depth (0.3 – 1; higher = brighter/stronger waves)
  opacity = .65,
  // amplitude: how far the ripples travel vertically (0 – 1; higher = taller, more energetic motion)
  amplitude = 0.85,
  // frequency: horizontal density of waves (0.0005 – 0.004; smaller value = smoother, larger = more ripples)
  frequency = 0.0005,
  // colorDrift: how much the gradient stops wander over time (0 – 1; higher = colors migrate further from their base stops)
  colorDrift = 0.85,
  // structureJitter: extra turbulence multiplier for the ribbon edges (0 – 1; higher = more entropy in shapes)
  structureJitter = 0.99,
  // centerDrift: vertical wobble per layer (0 – 0.2; higher lets layers roam farther up/down the viewport)
  centerDrift = 0.2,
  // thickness: upper bound for how wide layers can get (0.3 – 2; higher = overall thicker ribbons)
  thickness = 4,
  // thicknessVariation: how much individual layers breathe between thin and thick (0 – 1; higher = more fluctuation)
  thicknessVariation = 0.95,
  className,
}: WavyBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const waveNoise = createNoise2D()
    const turbulenceNoise = createNoise2D()
    const gradientNoise = createNoise2D()
    const layerConfigs: LayerConfig[] = [
      { orientation: 'top', baseHeight: 0.16, amplitudeScale: 0.26, frequencyScale: 1.8, opacityScale: 0.28, speedScale: 0.7, thicknessScale: 0.18 },
      { orientation: 'center', baseHeight: 0.38, amplitudeScale: 0.34, frequencyScale: 1.15, opacityScale: 0.48, speedScale: 0.95, thicknessScale: 0.55 },
      { orientation: 'center', baseHeight: 0.58, amplitudeScale: 0.28, frequencyScale: 0.9, opacityScale: 0.42, speedScale: 0.82, thicknessScale: 0.5 },
      { orientation: 'bottom', baseHeight: 0.84, amplitudeScale: 0.22, frequencyScale: 1.65, opacityScale: 0.33, speedScale: 0.68, thicknessScale: 0.2 },
    ]
    const container = canvas.parentElement

    let width = 0
    let height = 0
    let animationId = 0

    const setSize = () => {
      const bounds = container?.getBoundingClientRect()
      const nextWidth = bounds?.width ?? window.innerWidth
      const nextHeight = bounds?.height ?? window.innerHeight
      width = nextWidth
      height = nextHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(nextWidth * dpr)
      canvas.height = Math.round(nextHeight * dpr)
      canvas.style.width = `${nextWidth}px`
      canvas.style.height = `${nextHeight}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    setSize()

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => setSize())
        : null
    if (container && resizeObserver) {
      resizeObserver.observe(container)
    }
    const handleWindowResize = () => setSize()
    window.addEventListener('resize', handleWindowResize)

    let time = 0

    const drawLayer = (config: LayerConfig, layerIndex: number) => {
      ctx.globalAlpha = opacity * config.opacityScale
      const points: Array<{ x: number; top: number; bottom: number }> = []
      const frequencyValue = Math.max(0.0005, frequency * config.frequencyScale)
      const amplitudeValue = amplitude * config.amplitudeScale
      const layerTime = time * config.speedScale + layerIndex * 11
      const step = config.orientation === 'center' ? 14 : 20
      const horizontalFlow = time * 0.25 * config.speedScale

      for (let x = 0; x <= width; x += step) {
        const baseNoise = waveNoise(x * frequencyValue + layerIndex * 97 + horizontalFlow, layerTime + layerIndex * 41)
        const jitterNoise = turbulenceNoise(
          x * frequencyValue * 1.6 + layerIndex * 53 + horizontalFlow * 1.3,
          layerTime * 0.7 + layerIndex * 29,
        )
        const jitter = Math.max(0.25, 1 + jitterNoise * structureJitter)
        const baselineDrift = centerDrift * turbulenceNoise(layerIndex * 17 + x * 0.0009 + horizontalFlow * 0.2, layerTime * 0.3 + layerIndex * 13)
        const baseline = height * config.baseHeight + baselineDrift * height
        const displacement = baseNoise * height * amplitudeValue * jitter
        const core = clamp(baseline + displacement, 0, height)
        const thicknessNoise = Math.abs(
          turbulenceNoise(x * frequencyValue * 0.85 - layerIndex * 31 + horizontalFlow * 0.8, layerTime * 0.55 + layerIndex * 5),
        )
        const variationNoise = Math.abs(
          turbulenceNoise(layerIndex * 7 + layerTime * 0.18, x * 0.001 + layerIndex * 3 + horizontalFlow * 0.5),
        )
        const variation = 0.4 + variationNoise * thicknessVariation
        const thicknessBase = height * amplitudeValue * (config.thicknessScale ?? 0.4) * thickness * variation
        const thicknessAmount = thicknessBase * (0.35 + thicknessNoise)
        points.push({
          x,
          top: clamp(core - thicknessAmount, 0, height),
          bottom: clamp(core + thicknessAmount, 0, height),
        })
      }

      if (!points.length) return

      ctx.beginPath()
      if (config.orientation === 'top') {
        ctx.moveTo(0, 0)
        ctx.lineTo(points[0].x, points[0].bottom)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].bottom)
        }
        ctx.lineTo(width, 0)
      } else if (config.orientation === 'bottom') {
        ctx.moveTo(0, height)
        ctx.lineTo(points[0].x, points[0].top)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].top)
        }
        ctx.lineTo(width, height)
      } else {
        ctx.moveTo(points[0].x, points[0].top)
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].top)
        }
        for (let i = points.length - 1; i >= 0; i--) {
          ctx.lineTo(points[i].x, points[i].bottom)
        }
      }
      ctx.closePath()
      ctx.fill()
    }

    const draw = () => {
      time += speed
      ctx.clearRect(0, 0, width, height)
      ctx.filter = `blur(${blur}px)`

      if (colors.length > 1) {
        const gradient = ctx.createLinearGradient(-width * 0.1, 0, width * 1.1, height)
        const spacing = colors.length > 2 ? 0.02 : 0
        let previousStop = 0
        const stops = colors.map((color, index) => {
          const baseStop = colors.length === 1 ? 0 : index / (colors.length - 1)
          const driftScale = 0.5 * (1 / Math.max(1, colors.length - 1))
          const drift = gradientNoise(index * 0.35, time * 0.2 + index) * colorDrift * driftScale
          let target = clamp(baseStop + drift)
          if (index === 0) {
            target = 0
          } else if (index === colors.length - 1) {
            target = 1
          } else {
            const minStop = previousStop + spacing
            const maxStop = 1 - (colors.length - index - 1) * spacing
            target = clamp(target, minStop, maxStop)
          }
          previousStop = target
          return { color, stop: target }
        })
        stops.forEach(({ color, stop }) => gradient.addColorStop(stop, color))
        ctx.fillStyle = gradient
      } else {
        ctx.fillStyle = colors[0] ?? '#111731'
      }

      layerConfigs.forEach((config, index) => {
        drawLayer(config, index)
      })

      ctx.save()
      // Adjust these stops to control how quickly the color fades at the extremes
      const fadeMask = ctx.createLinearGradient(0, 0, 0, height)
      fadeMask.addColorStop(0, 'rgba(3, 6, 18, 0.55)')
      fadeMask.addColorStop(0.15, 'rgba(3, 6, 18, 0.25)')
      fadeMask.addColorStop(0.5, 'rgba(3, 6, 18, 0.12)')
      fadeMask.addColorStop(0.85, 'rgba(2, 5, 14, 0.28)')
      fadeMask.addColorStop(1, 'rgba(1, 3, 10, 0.5)')
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = fadeMask
      ctx.fillRect(0, 0, width, height)
      ctx.restore()

      animationId = requestAnimationFrame(draw)
    }

    animationId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleWindowResize)
      resizeObserver?.disconnect()
    }
  }, [amplitude, blur, centerDrift, colorDrift, colors, frequency, opacity, prefersReducedMotion, speed, structureJitter, thickness, thicknessVariation])

  if (prefersReducedMotion) {
    return (
      <div
        className={clsx('pointer-events-none absolute inset-0 z-0 opacity-80', className)}
        style={{
          // Update this gradient if you want a different static fallback look
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(0, 169, 255, 0.35), transparent 55%), linear-gradient(135deg, rgba(5, 7, 15, 0.9), rgba(17, 23, 49, 0.9))',
        }}
      />
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={clsx('pointer-events-none absolute inset-0 z-0', className)}
      aria-hidden
    />
  )
}

export default WavyBackground
