'use client'

import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { buildGlassVars } from '@/lib/demo/glass'
import { useDemoEffects } from '@/lib/demo/effects'

export default function DemoEffectsRoot({ children }: { children: ReactNode }) {
  const accent = useDemoEffects((state) => state.accent)
  const flags = useDemoEffects((state) => state.flags)
  const glass = useDemoEffects((state) => state.glass)
  const glassVars = useMemo(
    () => buildGlassVars(glass.tintShift, glass.opacity),
    [glass.opacity, glass.tintShift],
  )

  return (
    <div
      className="relative min-h-screen"
      data-demo-outline={flags.outlineComponents ? 'true' : 'false'}
      data-demo-edit={flags.editModeActive ? 'true' : 'false'}
      data-demo-editable={flags.showEditableRegions ? 'true' : 'false'}
      data-demo-glass={glass.style}
      style={{
        ['--demo-accent-primary' as string]: accent.primary,
        ['--demo-accent-secondary' as string]: accent.secondary,
        ['--demo-accent-glow' as string]: accent.glow,
        ['--demo-accent-icon' as string]: accent.icon,
        ['--demo-glass-tint' as string]: glassVars.tint,
        ['--demo-glass-surface' as string]: glassVars.surface,
        ['--demo-glass-base' as string]: glassVars.base,
      }}
    >
      {children}
    </div>
  )
}
