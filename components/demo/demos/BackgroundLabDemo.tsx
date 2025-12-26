'use client'

import { useEffect, useMemo, useState } from 'react'
import { Gauge, Palette, RotateCcw, Shuffle } from 'lucide-react'
import { backgroundPresets, DEFAULT_BACKGROUND_CONFIG } from '@/lib/demo/background'
import { useBackgroundLabState } from '@/components/demo/state/BackgroundLabState'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { cn } from '@/lib/utils'

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

const createLoadScore = (speed: number, noise: number, glow: number) =>
  Math.min(100, Math.round((speed / 2.5) * 35 + (noise / 1.5) * 45 + glow * 25))

type SliderRowProps = {
  label: string
  valueLabel: string
  min: number
  max: number
  step?: number
  value: number
  onChange: (value: number) => void
  onReset?: () => void
  helper?: string
}

const SliderRow = ({ label, valueLabel, min, max, step = 0.01, value, onChange, onReset, helper }: SliderRowProps) => (
  <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {helper && <p className="text-xs text-text-muted">{helper}</p>}
      </div>
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted">
        <span>{valueLabel}</span>
        {onReset && (
          <button type="button" onClick={onReset} className="rounded-full border border-white/10 p-1">
            <RotateCcw className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
    <input
      className="demo-slider"
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    />
  </div>
)

export default function BackgroundLabDemo() {
  const { setShellState, pushToast } = useDemoEngine()
  const { config, setConfig, reset } = useBackgroundLabState()
  const [advancedColor, setAdvancedColor] = useState(config.paletteId === 'custom')
  const [fps, setFps] = useState(60)

  useEffect(() => {
    setAdvancedColor(config.paletteId === 'custom')
  }, [config.paletteId])

  useEffect(() => {
    setShellState({
      status: { label: 'Live', tone: 'live' },
      onReset: () => {
        reset()
        pushToast('Background reset to defaults.', 'warning')
      },
      closeLabel: 'Close',
    })
  }, [pushToast, reset, setShellState])

  useEffect(() => {
    let animationId = 0
    let lastTime = performance.now()
    let frames = 0

    const tick = (time: number) => {
      frames += 1
      if (time - lastTime >= 1000) {
        setFps(Math.round((frames * 1000) / (time - lastTime)))
        lastTime = time
        frames = 0
      }
      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animationId)
  }, [])

  const applyPreset = (presetId: keyof typeof backgroundPresets) => {
    const target = backgroundPresets[presetId].config
    const start = config
    const startTime = performance.now()
    const duration = 700

    const animate = (time: number) => {
      const progress = Math.min(1, (time - startTime) / duration)
      const eased = easeInOut(progress)

      setConfig({
        ...start,
        speed: start.speed + (target.speed - start.speed) * eased,
        noiseIntensity: start.noiseIntensity + (target.noiseIntensity - start.noiseIntensity) * eased,
        parallaxDepth: start.parallaxDepth + (target.parallaxDepth - start.parallaxDepth) * eased,
        motionDamping: start.motionDamping + (target.motionDamping - start.motionDamping) * eased,
        glow: start.glow + (target.glow - start.glow) * eased,
        grain: start.grain + (target.grain - start.grain) * eased,
        vignette: start.vignette + (target.vignette - start.vignette) * eased,
        accentHue: start.accentHue + (target.accentHue - start.accentHue) * eased,
        paletteId: target.paletteId,
        reduceMotion: target.reduceMotion,
      })

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
    pushToast(`Preset applied: ${backgroundPresets[presetId].label}.`, 'success')
  }

  const handleRandomize = () => {
    const next = {
      ...config,
      speed: 0.3 + Math.random() * 2.1,
      noiseIntensity: Math.random() * 1.4,
      parallaxDepth: Math.random(),
      motionDamping: 0.05 + Math.random() * 0.3,
      glow: Math.random(),
      grain: Math.random(),
      vignette: Math.random(),
      accentHue: Math.round(Math.random() * 360),
      paletteId: 'custom' as const,
    }
    setConfig(next)
    setAdvancedColor(true)
    pushToast('Shuffled a new background profile.', 'success')
  }

  const loadScore = useMemo(() => createLoadScore(config.speed, config.noiseIntensity, config.glow), [config])

  return (
    <div className="space-y-6">
      <LiquidGlass variant="dense" className="flex flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Telemetry</p>
          <p className="mt-1 text-sm text-text-secondary">Engine live - Canvas renderer</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.2em] text-text-muted">
          <span>FPS {fps}</span>
          <span>Load {loadScore}%</span>
          <span>Mode Canvas</span>
        </div>
      </LiquidGlass>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Presets</h4>
          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-muted"
          >
            <Shuffle className="h-3 w-3" /> Shuffle
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {Object.entries(backgroundPresets).map(([key, preset]) => (
            <button
              key={key}
              type="button"
              onClick={() => applyPreset(key as keyof typeof backgroundPresets)}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition hover:border-white/20"
            >
              <p className="text-sm font-semibold text-white">{preset.label}</p>
              <p className="text-xs text-text-muted">{preset.description}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Motion</h4>
        <SliderRow
          label="Animation Speed"
          helper="Cinematic -> Hyper"
          valueLabel={config.speed.toFixed(2)}
          min={0.2}
          max={2.5}
          step={0.01}
          value={config.speed}
          onChange={(value) => setConfig((prev) => ({ ...prev, speed: value }))}
          onReset={() => setConfig((prev) => ({ ...prev, speed: DEFAULT_BACKGROUND_CONFIG.speed }))}
        />
        <SliderRow
          label="Noise Intensity"
          helper="Smooth -> Turbulent"
          valueLabel={config.noiseIntensity.toFixed(2)}
          min={0}
          max={1.5}
          step={0.01}
          value={config.noiseIntensity}
          onChange={(value) => setConfig((prev) => ({ ...prev, noiseIntensity: value }))}
          onReset={() => setConfig((prev) => ({ ...prev, noiseIntensity: DEFAULT_BACKGROUND_CONFIG.noiseIntensity }))}
        />
      </section>

      <section className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Depth</h4>
        <SliderRow
          label="Layer Depth"
          helper="Subtle depth layering"
          valueLabel={config.parallaxDepth.toFixed(2)}
          min={0}
          max={1}
          step={0.01}
          value={config.parallaxDepth}
          onChange={(value) => setConfig((prev) => ({ ...prev, parallaxDepth: value }))}
          onReset={() => setConfig((prev) => ({ ...prev, parallaxDepth: DEFAULT_BACKGROUND_CONFIG.parallaxDepth }))}
        />
        <SliderRow
          label="Motion Damping"
          helper="Snappy -> Floaty"
          valueLabel={config.motionDamping.toFixed(2)}
          min={0.05}
          max={0.35}
          step={0.01}
          value={config.motionDamping}
          onChange={(value) => setConfig((prev) => ({ ...prev, motionDamping: value }))}
          onReset={() => setConfig((prev) => ({ ...prev, motionDamping: DEFAULT_BACKGROUND_CONFIG.motionDamping }))}
        />
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Color</h4>
          <button
            type="button"
            onClick={() => {
              setAdvancedColor((prev) => !prev)
              setConfig((prev) => ({
                ...prev,
                paletteId: !advancedColor ? 'custom' : 'dark',
              }))
            }}
            className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-text-muted"
          >
            <Palette className="h-3 w-3" /> Advanced
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {['dark', 'neon', 'calm'].map((palette) => (
            <button
              key={palette}
              type="button"
              onClick={() => setConfig((prev) => ({ ...prev, paletteId: palette as typeof config.paletteId }))}
              className={cn(
                'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition',
                config.paletteId === palette
                  ? 'border-emerald-400/60 text-emerald-200'
                  : 'border-white/10 text-text-muted hover:text-white',
              )}
            >
              {palette}
            </button>
          ))}
        </div>
        {advancedColor && (
          <SliderRow
            label="Accent Hue"
            helper="Custom spectrum"
            valueLabel={`${Math.round(config.accentHue)} deg`}
            min={0}
            max={360}
            step={1}
            value={config.accentHue}
            onChange={(value) => setConfig((prev) => ({ ...prev, accentHue: value, paletteId: 'custom' }))}
          />
        )}
      </section>

      <section className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Quality</h4>
        <SliderRow
          label="Glow"
          valueLabel={config.glow.toFixed(2)}
          min={0}
          max={1}
          step={0.01}
          value={config.glow}
          onChange={(value) => setConfig((prev) => ({ ...prev, glow: value }))}
          onReset={() => setConfig((prev) => ({ ...prev, glow: DEFAULT_BACKGROUND_CONFIG.glow }))}
        />
        <SliderRow
          label="Grain"
          valueLabel={config.grain.toFixed(2)}
          min={0}
          max={1}
          step={0.01}
          value={config.grain}
          onChange={(value) => setConfig((prev) => ({ ...prev, grain: value }))}
          onReset={() => setConfig((prev) => ({ ...prev, grain: DEFAULT_BACKGROUND_CONFIG.grain }))}
        />
        <SliderRow
          label="Vignette"
          valueLabel={config.vignette.toFixed(2)}
          min={0}
          max={1}
          step={0.01}
          value={config.vignette}
          onChange={(value) => setConfig((prev) => ({ ...prev, vignette: value }))}
          onReset={() => setConfig((prev) => ({ ...prev, vignette: DEFAULT_BACKGROUND_CONFIG.vignette }))}
        />
      </section>

      <section className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Accessibility</h4>
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">Reduce Motion</p>
            <p className="text-xs text-text-muted">Lower speed and settle background drift.</p>
          </div>
          <button
            type="button"
            onClick={() =>
              setConfig((prev) => ({
                ...prev,
                reduceMotion: !prev.reduceMotion,
              }))
            }
            className={cn(
              'relative h-7 w-12 rounded-full border border-white/10 transition',
              config.reduceMotion ? 'bg-emerald-400/40' : 'bg-white/10',
            )}
            aria-pressed={config.reduceMotion}
          >
            <span
              className={cn(
                'absolute top-1 h-5 w-5 rounded-full bg-white transition',
                config.reduceMotion ? 'left-6' : 'left-1',
              )}
            />
          </button>
        </div>
      </section>

      <LiquidGlass variant="dense" className="flex items-center justify-between px-4 py-3 text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          <span>Engine powers card glows + background gradients.</span>
        </div>
        <span className="uppercase tracking-[0.2em]">Live</span>
      </LiquidGlass>
    </div>
  )
}
