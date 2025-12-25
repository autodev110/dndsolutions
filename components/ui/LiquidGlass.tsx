'use client'

import { ComponentPropsWithoutRef, CSSProperties, ElementType } from 'react'
import { cn } from '@/lib/utils'

type LiquidGlassVariant = 'hero' | 'header' | 'headerStrong' | 'panel' | 'card' | 'dense' | 'chip' | 'fab'

const MATERIAL_PRESETS: Record<
  LiquidGlassVariant,
  {
    blur: number
    saturation: number
    brightness: number
    contrast: number
    tint: string
    surface: string
    borderAlpha: number
    edgeBloom: number
    noise: number
    radius: string
    dispersion: number
    rimHighlight: number
    rimShadow: number
    ambientBloom: number
    shadowStrength: number
    warp: number
  }
> = {
  hero: {
    blur: 14,
    saturation: 1.22,
    brightness: 1.01,
    contrast: 1.06,
    tint: 'rgba(9, 13, 24, 0.62)',
    surface: 'rgba(255, 255, 255, 0.04)',
    borderAlpha: 0.3,
    edgeBloom: 0.58,
    noise: 0.12,
    radius: '3rem',
    dispersion: 0.6,
    rimHighlight: 0.88,
    rimShadow: 0.42,
    ambientBloom: 0.28,
    shadowStrength: 0.42,
    warp: 22,
  },
  header: {
    blur: 12,
    saturation: 1.2,
    brightness: 1.01,
    contrast: 1.04,
    tint: 'rgba(7, 10, 18, 0.65)',
    surface: 'rgba(255, 255, 255, 0.04)',
    borderAlpha: 0.26,
    edgeBloom: 0.46,
    noise: 0.1,
    radius: '999px',
    dispersion: 0.52,
    rimHighlight: 0.76,
    rimShadow: 0.35,
    ambientBloom: 0.24,
    shadowStrength: 0.36,
    warp: 18,
  },
  headerStrong: {
    blur: 16,
    saturation: 1.35,
    brightness: 1.0,
    contrast: 1.08,
    tint: 'rgba(6, 9, 16, 0.78)',
    surface: 'rgba(25, 52, 92, 0.12)',
    borderAlpha: 0.35,
    edgeBloom: 0.58,
    noise: 0.14,
    radius: '3rem',
    dispersion: 0.62,
    rimHighlight: 0.92,
    rimShadow: 0.4,
    ambientBloom: 0.3,
    shadowStrength: 0.4,
    warp: 30,
  },
  panel: {
    blur: 12,
    saturation: 1.22,
    brightness: 1.02,
    contrast: 1.05,
    tint: 'rgba(10, 14, 24, 0.6)',
    surface: 'rgba(255, 255, 255, 0.04)',
    borderAlpha: 0.27,
    edgeBloom: 0.45,
    noise: 0.12,
    radius: '1.9rem',
    dispersion: 0.48,
    rimHighlight: 0.7,
    rimShadow: 0.32,
    ambientBloom: 0.24,
    shadowStrength: 0.34,
    warp: 18,
  },
  card: {
    blur: 11,
    saturation: 1.2,
    brightness: 1.02,
    contrast: 1.04,
    tint: 'rgba(11, 15, 26, 0.58)',
    surface: 'rgba(255, 255, 255, 0.04)',
    borderAlpha: 0.26,
    edgeBloom: 0.42,
    noise: 0.11,
    radius: '1.4rem',
    dispersion: 0.44,
    rimHighlight: 0.64,
    rimShadow: 0.3,
    ambientBloom: 0.22,
    shadowStrength: 0.32,
    warp: 16,
  },
  dense: {
    blur: 11,
    saturation: 1.18,
    brightness: 0.98,
    contrast: 1.05,
    tint: 'rgba(4, 6, 12, 0.72)',
    surface: 'rgba(12, 20, 36, 0.12)',
    borderAlpha: 0.28,
    edgeBloom: 0.42,
    noise: 0.12,
    radius: '1.1rem',
    dispersion: 0.36,
    rimHighlight: 0.52,
    rimShadow: 0.32,
    ambientBloom: 0.18,
    shadowStrength: 0.35,
    warp: 14,
  },
  chip: {
    blur: 12,
    saturation: 1.28,
    brightness: 1.02,
    contrast: 1.05,
    tint: 'rgba(9, 13, 22, 0.6)',
    surface: 'rgba(255, 255, 255, 0.05)',
    borderAlpha: 0.25,
    edgeBloom: 0.5,
    noise: 0.12,
    radius: '999px',
    dispersion: 0.55,
    rimHighlight: 0.82,
    rimShadow: 0.35,
    ambientBloom: 0.28,
    shadowStrength: 0.34,
    warp: 20,
  },
  fab: {
    blur: 13,
    saturation: 1.35,
    brightness: 1.03,
    contrast: 1.06,
    tint: 'rgba(16, 41, 83, 0.65)',
    surface: 'rgba(63, 150, 255, 0.19)',
    borderAlpha: 0.35,
    edgeBloom: 0.62,
    noise: 0.12,
    radius: '999px',
    dispersion: 0.58,
    rimHighlight: 0.92,
    rimShadow: 0.34,
    ambientBloom: 0.32,
    shadowStrength: 0.4,
    warp: 22,
  },
}

type LiquidGlassProps<T extends ElementType> = {
  as?: T
  variant?: LiquidGlassVariant
} & ComponentPropsWithoutRef<T>

const LiquidGlass = <T extends ElementType = 'div'>({
  as,
  variant = 'panel',
  className,
  style,
  children,
  ...rest
}: LiquidGlassProps<T>) => {
  const Component = (as ?? 'div') as ElementType
  const preset = MATERIAL_PRESETS[variant] ?? MATERIAL_PRESETS.panel

  const cssVariables: CSSProperties & Record<string, string> = {
    '--lg-blur': `${preset.blur}px`,
    '--lg-saturation': preset.saturation.toString(),
    '--lg-brightness': preset.brightness.toString(),
    '--lg-contrast': preset.contrast.toString(),
    '--lg-tint': preset.tint,
    '--lg-surface': preset.surface,
    '--lg-border-alpha': preset.borderAlpha.toString(),
    '--lg-edge-bloom': preset.edgeBloom.toString(),
    '--lg-noise-opacity': preset.noise.toString(),
    '--lg-radius': preset.radius,
    '--lg-dispersion': preset.dispersion.toString(),
    '--lg-rim-highlight': preset.rimHighlight.toString(),
    '--lg-rim-shadow': preset.rimShadow.toString(),
    '--lg-ambient-bloom': preset.ambientBloom.toString(),
    '--lg-shadow-strength': preset.shadowStrength.toString(),
    '--lg-warp-width': `${preset.warp}px`,
  }

  return (
    <Component
      className={cn('liquid-glass', className)}
      data-variant={variant}
      style={{ ...cssVariables, ...style }}
      {...(rest as ComponentPropsWithoutRef<T>)}
    >
      {children}
    </Component>
  )
}

export default LiquidGlass
