'use client'

import { useMemo } from 'react'
import WavyBackground from '@/components/home/WavyBackground'
import { mapToWavyConfig } from '@/lib/demo/background'
import { useDemoEffects } from '@/lib/demo/effects'

export default function GlobalBackground() {
  const background = useDemoEffects((state) => state.background)
  const wavyConfig = useMemo(() => mapToWavyConfig(background), [background])

  const glowOpacity = 0.12 + background.glow * 0.32
  const vignetteOpacity = 0.25 + background.vignette * 0.35
  const grainOpacity = background.grain * 0.35

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute inset-0">
        <WavyBackground className="opacity-95" {...wavyConfig} />
      </div>
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(32,182,255,0.25),_transparent_62%)] transition-opacity duration-500"
        style={{ opacity: glowOpacity }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#02040a]/40 via-[#09112b]/30 to-[#01030a]/70 transition-opacity duration-500"
        style={{ opacity: vignetteOpacity }}
      />
      <div
        className="absolute inset-0 mix-blend-soft-light transition-opacity duration-500"
        style={{ backgroundImage: 'var(--lg-noise-source)', opacity: grainOpacity }}
      />
    </div>
  )
}
