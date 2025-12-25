'use client'

import WavyBackground from '@/components/home/WavyBackground'

export default function GlobalBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
      <WavyBackground
        className="opacity-95"
        colors={['#050914', '#081a2f', '#0b2038', '#13466c', '#1c7dd1', '#2fb9ff', '#8fe5ff', '#3f7ce6']}
        speed={0.00135}
        blur={18}
        amplitude={0.4}
        frequency={0.0014}
        opacity={0.96}
        colorDrift={0.32}
        structureJitter={0.6}
        centerDrift={0.09}
        thickness={4.5}
        thicknessVariation={0.82}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(32,182,255,0.23),_transparent_62%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#02040a]/40 via-[#09112b]/30 to-[#01030a]/70" />
    </div>
  )
}
