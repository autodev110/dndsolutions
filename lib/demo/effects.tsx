'use client'

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'
import type { DemoContent } from './content'
import { DEFAULT_CONTENT } from './content'
import type { BackgroundEngineConfig } from './background'
import { DEFAULT_BACKGROUND_CONFIG } from './background'
import type { GlassSettings } from './glass'
import { DEFAULT_GLASS_SETTINGS } from './glass'
import type { IndustryProfile } from './industry'
import { DEFAULT_LABELS } from './industry'
import { DEFAULT_LAYOUT } from './layout'
import { mergeContent } from './utils'

export type HeroVariant = 'classic' | 'split' | 'centered' | 'dense'
export type SpacingDensity = 'compact' | 'normal' | 'spacious'
export type CardDensity = 'comfortable' | 'compact' | 'spacious'

export type DemoEffectsState = {
  content: {
    base: DemoContent
    industryOverride: Partial<DemoContent> | null
    editOverride: DemoContent | null
    effective: DemoContent
  }
  layout: {
    heroVariant: HeroVariant
    spacingDensity: SpacingDensity
    cardDensity: CardDensity
    demosOrder: string[]
    sectionsOrder: string[]
  }
  background: BackgroundEngineConfig
  glass: GlassSettings
  accent: {
    primary: string
    secondary: string
    glow: string
    icon: string
  }
  industryId: IndustryProfile['id'] | null
  labels: {
    leads: string
    revenue: string
    pipeline: string
    users: string
  }
  flags: {
    editModeActive: boolean
    inlineEditing: boolean
    showEditableRegions: boolean
    outlineComponents: boolean
    reorderCards: boolean
    reorderSections: boolean
  }
}

type DemoEffectsStore = {
  getState: () => DemoEffectsState
  setState: (updater: (prev: DemoEffectsState) => DemoEffectsState) => void
  subscribe: (listener: () => void) => () => void
}

const createStore = (initialState: DemoEffectsState): DemoEffectsStore => {
  let state = initialState
  const listeners = new Set<() => void>()

  return {
    getState: () => state,
    setState: (updater) => {
      state = updater(state)
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}

const initialState: DemoEffectsState = {
  content: {
    base: DEFAULT_CONTENT,
    industryOverride: null,
    editOverride: null,
    effective: DEFAULT_CONTENT,
  },
  layout: {
    ...DEFAULT_LAYOUT,
  },
  background: DEFAULT_BACKGROUND_CONFIG,
  glass: DEFAULT_GLASS_SETTINGS,
  accent: {
    primary: '#00FFAB',
    secondary: '#00A9FF',
    glow: 'rgba(0, 255, 171, 0.35)',
    icon: '#8FF5FF',
  },
  industryId: null,
  labels: DEFAULT_LABELS,
  flags: {
    editModeActive: false,
    inlineEditing: true,
    showEditableRegions: true,
    outlineComponents: false,
    reorderCards: false,
    reorderSections: false,
  },
}

const DemoEffectsStoreContext = createContext<DemoEffectsStore | null>(null)

const rebuildContent = (state: DemoEffectsState) => {
  const overlays = state.flags.editModeActive
    ? [state.content.industryOverride, state.content.editOverride]
    : [state.content.editOverride, state.content.industryOverride]
  const nextEffective = mergeContent(state.content.base, ...overlays)

  return {
    ...state.content,
    effective: nextEffective,
  }
}

export function DemoEffectsProvider({ children }: { children: React.ReactNode }) {
  const store = useMemo(() => createStore(initialState), [])
  return <DemoEffectsStoreContext.Provider value={store}>{children}</DemoEffectsStoreContext.Provider>
}

export const useDemoEffects = <T,>(selector: (state: DemoEffectsState) => T) => {
  const store = useContext(DemoEffectsStoreContext)
  if (!store) {
    throw new Error('useDemoEffects must be used within DemoEffectsProvider')
  }
  return useSyncExternalStore(store.subscribe, () => selector(store.getState()), () => selector(store.getState()))
}

export const useDemoEffectsActions = () => {
  const store = useContext(DemoEffectsStoreContext)
  if (!store) {
    throw new Error('useDemoEffectsActions must be used within DemoEffectsProvider')
  }

  return {
    setIndustryProfile: (profile: IndustryProfile | null) => {
      store.setState((prev) => {
        const next = {
          ...prev,
          content: rebuildContent({
            ...prev,
            content: {
              ...prev.content,
              industryOverride: profile?.copy ?? null,
            },
          }),
          accent: profile
            ? {
                primary: profile.palette.primary,
                secondary: profile.palette.secondary,
                glow: profile.palette.glow,
                icon: profile.palette.icon,
              }
            : initialState.accent,
          industryId: profile?.id ?? null,
          labels: profile ? profile.labels : initialState.labels,
        }

        return next
      })
    },
    setEditModeOverride: (override: DemoContent | null) => {
      store.setState((prev) => ({
        ...prev,
        content: rebuildContent({
          ...prev,
          content: {
            ...prev.content,
            editOverride: override,
          },
        }),
      }))
    },
    setLayout: (partial: Partial<DemoEffectsState['layout']>) => {
      store.setState((prev) => ({
        ...prev,
        layout: {
          ...prev.layout,
          ...partial,
        },
      }))
    },
    setFlags: (partial: Partial<DemoEffectsState['flags']>) => {
      store.setState((prev) => {
        const nextState = {
          ...prev,
          flags: {
            ...prev.flags,
            ...partial,
          },
        }
        return {
          ...nextState,
          content: rebuildContent(nextState),
        }
      })
    },
    setBackground: (partial: Partial<BackgroundEngineConfig>) => {
      store.setState((prev) => ({
        ...prev,
        background: {
          ...prev.background,
          ...partial,
        },
      }))
    },
    setGlass: (partial: Partial<GlassSettings>) => {
      store.setState((prev) => ({
        ...prev,
        glass: {
          ...prev.glass,
          ...partial,
        },
      }))
    },
    resetAllEffects: () => {
      store.setState(() => initialState)
    },
    getState: () => store.getState(),
  }
}
