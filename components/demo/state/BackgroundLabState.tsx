'use client'

import { createContext, useContext, useEffect, useMemo, useRef } from 'react'
import type { BackgroundEngineConfig } from '@/lib/demo/background'
import { DEFAULT_BACKGROUND_CONFIG } from '@/lib/demo/background'
import { useDemoEffectsActions } from '@/lib/demo/effects'
import { useDemoStorage } from '@/lib/demo/useDemoStorage'
import { usePrefersReducedMotion } from '@/lib/hooks/usePrefersReducedMotion'

type BackgroundLabStateValue = {
  config: BackgroundEngineConfig
  setConfig: (updater: BackgroundEngineConfig | ((prev: BackgroundEngineConfig) => BackgroundEngineConfig)) => void
  reset: () => void
  hydrated: boolean
}

const BackgroundLabContext = createContext<BackgroundLabStateValue | null>(null)

export function BackgroundLabStateProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const { setBackground } = useDemoEffectsActions()
  const { draft, setDraft, reset, hydrated } = useDemoStorage<BackgroundEngineConfig>(
    'background-lab',
    DEFAULT_BACKGROUND_CONFIG,
    { debounceMs: 120 },
  )
  const preferenceAppliedRef = useRef(false)

  useEffect(() => {
    if (!hydrated) return
    setBackground(draft)
  }, [draft, hydrated, setBackground])

  useEffect(() => {
    if (!hydrated || !prefersReducedMotion || preferenceAppliedRef.current) return
    preferenceAppliedRef.current = true
    setDraft((prev) => ({
      ...prev,
      reduceMotion: true,
      speed: Math.min(prev.speed, 0.5),
      parallaxDepth: Math.min(prev.parallaxDepth, 0.2),
    }))
  }, [hydrated, prefersReducedMotion, setDraft])

  const value = useMemo(
    () => ({
      config: draft,
      setConfig: setDraft,
      reset: () => reset(true),
      hydrated,
    }),
    [draft, reset, hydrated, setDraft],
  )

  return <BackgroundLabContext.Provider value={value}>{children}</BackgroundLabContext.Provider>
}

export const useBackgroundLabState = () => {
  const context = useContext(BackgroundLabContext)
  if (!context) {
    throw new Error('useBackgroundLabState must be used within BackgroundLabStateProvider')
  }
  return context
}
