import { clamp } from './utils'

export type BackgroundPaletteId = 'dark' | 'neon' | 'calm' | 'custom'

export type BackgroundEngineConfig = {
  speed: number
  noiseIntensity: number
  paletteId: BackgroundPaletteId
  accentHue: number
  parallaxDepth: number
  motionDamping: number
  glow: number
  grain: number
  vignette: number
  reduceMotion: boolean
}

export const DEFAULT_BACKGROUND_CONFIG: BackgroundEngineConfig = {
  speed: 0.95,
  noiseIntensity: 0.6,
  paletteId: 'dark',
  accentHue: 210,
  parallaxDepth: 0.35,
  motionDamping: 0.18,
  glow: 0.45,
  grain: 0.22,
  vignette: 0.55,
  reduceMotion: false,
}

export const BACKGROUND_PALETTES: Record<Exclude<BackgroundPaletteId, 'custom'>, string[]> = {
  dark: ['#050914', '#081a2f', '#0b2038', '#13466c', '#1c7dd1', '#2fb9ff', '#8fe5ff', '#3f7ce6'],
  neon: ['#0a0717', '#11104a', '#2b1b70', '#4a2299', '#6f2ed1', '#9d52ff', '#53c8ff', '#4efad1'],
  calm: ['#060b1f', '#0d1b2b', '#123341', '#1c5b6b', '#248e9c', '#59b9c3', '#96e2e2', '#3a7f89'],
}

export const backgroundPresets: Record<
  'finance' | 'healthcare' | 'creative' | 'enterprise',
  { label: string; description: string; config: BackgroundEngineConfig }
> = {
  finance: {
    label: 'Finance',
    description: 'Crisp & analytical',
    config: {
      speed: 1.15,
      noiseIntensity: 0.32,
      paletteId: 'dark',
      accentHue: 206,
      parallaxDepth: 0.22,
      motionDamping: 0.22,
      glow: 0.4,
      grain: 0.18,
      vignette: 0.6,
      reduceMotion: false,
    },
  },
  healthcare: {
    label: 'Healthcare',
    description: 'Calm & trustworthy',
    config: {
      speed: 0.45,
      noiseIntensity: 0.2,
      paletteId: 'calm',
      accentHue: 170,
      parallaxDepth: 0.15,
      motionDamping: 0.28,
      glow: 0.3,
      grain: 0.15,
      vignette: 0.65,
      reduceMotion: false,
    },
  },
  creative: {
    label: 'Creative',
    description: 'Expressive & kinetic',
    config: {
      speed: 1.6,
      noiseIntensity: 0.9,
      paletteId: 'neon',
      accentHue: 280,
      parallaxDepth: 0.55,
      motionDamping: 0.12,
      glow: 0.75,
      grain: 0.35,
      vignette: 0.45,
      reduceMotion: false,
    },
  },
  enterprise: {
    label: 'Enterprise',
    description: 'Reserved & premium',
    config: {
      speed: 0.7,
      noiseIntensity: 0.35,
      paletteId: 'dark',
      accentHue: 210,
      parallaxDepth: 0.25,
      motionDamping: 0.24,
      glow: 0.35,
      grain: 0.2,
      vignette: 0.7,
      reduceMotion: false,
    },
  },
}

const createCustomPalette = (accentHue: number) => {
  const hue = ((accentHue % 360) + 360) % 360
  return [
    `hsl(${hue}, 42%, 12%)`,
    `hsl(${hue + 10}, 52%, 18%)`,
    `hsl(${hue + 22}, 62%, 24%)`,
    `hsl(${hue + 28}, 72%, 34%)`,
    `hsl(${hue + 36}, 78%, 46%)`,
    `hsl(${hue + 44}, 82%, 58%)`,
    `hsl(${hue + 52}, 88%, 68%)`,
  ]
}

export const getPaletteColors = (config: BackgroundEngineConfig) => {
  if (config.paletteId === 'custom') {
    return createCustomPalette(config.accentHue)
  }
  return BACKGROUND_PALETTES[config.paletteId]
}

export const mapToWavyConfig = (config: BackgroundEngineConfig) => {
  const speedBase = config.reduceMotion ? 0.00035 : config.speed * 0.001
  const noise = clamp(config.noiseIntensity / 1.5, 0, 1)
  const depth = clamp(config.parallaxDepth, 0, 1)
  const damping = clamp((config.motionDamping - 0.05) / 0.3, 0, 1)

  return {
    colors: getPaletteColors(config),
    speed: clamp(speedBase * (1 - damping * 0.35), 0.0002, 0.003),
    blur: 14 + noise * 14,
    amplitude: 0.3 + noise * 0.35 + depth * 0.18,
    frequency: 0.0011 + noise * 0.0009,
    opacity: 0.94,
    colorDrift: (0.2 + noise * 0.4 + depth * 0.15) * (1 - damping * 0.2),
    structureJitter: (0.35 + noise * 0.65) * (1 - damping * 0.2),
    centerDrift: 0.06 + noise * 0.12 + depth * 0.04,
    thickness: 4.2 + noise * 1.8 + depth * 0.5,
    thicknessVariation: clamp(0.5 + noise * 0.5 + depth * 0.2, 0.3, 1.2),
  }
}
