export type GlassStyle = 'liquid' | 'frosted'

export type GlassSettings = {
  style: GlassStyle
  opacity: number
  tintShift: number
}

type RgbColor = { r: number; g: number; b: number; a: number }
type HslColor = { h: number; s: number; l: number; a: number }

export type GlassColorVars = {
  tint: string
  surface: string
  base: string
}

export const DEFAULT_GLASS_SETTINGS: GlassSettings = {
  style: 'liquid',
  opacity: 1,
  tintShift: 0,
}

const baseGlassColors = {
  tint: { r: 34, g: 48, b: 84, a: 0.18 },
  surface: { r: 6, g: 9, b: 18, a: 0.45 },
  base: { r: 5, g: 7, b: 13, a: 0.24 },
}

const rgbToHsl = ({ r, g, b, a }: RgbColor): HslColor => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min
  let hue = 0
  let saturation = 0
  const lightness = (max + min) / 2

  if (delta !== 0) {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)
    switch (max) {
      case red:
        hue = (green - blue) / delta + (green < blue ? 6 : 0)
        break
      case green:
        hue = (blue - red) / delta + 2
        break
      default:
        hue = (red - green) / delta + 4
        break
    }
    hue *= 60
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
    a,
  }
}

const baseGlassHsl = {
  tint: rgbToHsl(baseGlassColors.tint),
  surface: rgbToHsl(baseGlassColors.surface),
  base: rgbToHsl(baseGlassColors.base),
}

const clampAlpha = (value: number) => Math.min(1.6, Math.max(0, value))

export const buildGlassVars = (tintShift: number, opacity: number): GlassColorVars => {
  const alpha = clampAlpha(opacity)
  if (tintShift === 0) {
    return {
      tint: `rgba(${baseGlassColors.tint.r}, ${baseGlassColors.tint.g}, ${baseGlassColors.tint.b}, ${(baseGlassColors.tint.a * alpha).toFixed(3)})`,
      surface: `rgba(${baseGlassColors.surface.r}, ${baseGlassColors.surface.g}, ${baseGlassColors.surface.b}, ${(baseGlassColors.surface.a * alpha).toFixed(3)})`,
      base: `rgba(${baseGlassColors.base.r}, ${baseGlassColors.base.g}, ${baseGlassColors.base.b}, ${(baseGlassColors.base.a * alpha).toFixed(3)})`,
    }
  }

  const shiftHue = (color: HslColor) => {
    const hue = (color.h + tintShift + 360) % 360
    const nextAlpha = clampAlpha(color.a * alpha)
    return `hsla(${hue} ${color.s}% ${color.l}% / ${nextAlpha.toFixed(3)})`
  }

  return {
    tint: shiftHue(baseGlassHsl.tint),
    surface: shiftHue(baseGlassHsl.surface),
    base: shiftHue(baseGlassHsl.base),
  }
}
