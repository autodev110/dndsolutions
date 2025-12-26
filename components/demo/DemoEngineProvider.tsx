'use client'

import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { DemoId } from '@/lib/demo/demoData'
import { clearAllDemoStorage } from '@/lib/demo/storage'
import { DemoEffectsProvider, useDemoEffectsActions } from '@/lib/demo/effects'
import DemoEffectsRoot from '@/components/demo/DemoEffectsRoot'
import DemoShell from '@/components/demo/DemoShell'
import DemoToasts from '@/components/demo/DemoToasts'
import { demoRegistry, type DemoDefinition } from '@/components/demo/registry'
import { BackgroundLabStateProvider } from '@/components/demo/state/BackgroundLabState'
import { EditModeStateProvider } from '@/components/demo/state/EditModeState'
import { IndustryStateProvider } from '@/components/demo/state/IndustryState'

export type DemoShellStatus = 'saved' | 'unsaved' | 'live'

export type DemoShellState = {
  status?: {
    label: string
    tone: DemoShellStatus
  }
  showSave?: boolean
  onSave?: () => void
  onReset?: () => void
  closeLabel?: string
}

type DemoToast = {
  id: string
  message: string
  tone?: 'default' | 'success' | 'warning'
}

type DemoEngineContextValue = {
  openDemoId: DemoId | null
  registry: DemoDefinition[]
  openDemo: (demoId: DemoId) => void
  closeDemo: () => void
  requestClose: () => void
  registerCloseGuard: (guard: (() => boolean | void) | null) => void
  shellState: DemoShellState
  setShellState: React.Dispatch<React.SetStateAction<DemoShellState>>
  pushToast: (message: string, tone?: DemoToast['tone']) => void
  resetAllDemos: () => void
  toasts: DemoToast[]
}

const DemoEngineContext = createContext<DemoEngineContextValue | null>(null)

const createToastId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

function DemoEngineInner({ children }: { children: React.ReactNode }) {
  const [openDemoId, setOpenDemoId] = useState<DemoId | null>(null)
  const [shellState, setShellState] = useState<DemoShellState>({})
  const [toasts, setToasts] = useState<DemoToast[]>([])
  const closeGuardRef = useRef<(() => boolean | void) | null>(null)
  const { resetAllEffects } = useDemoEffectsActions()

  const openDemo = useCallback((demoId: DemoId) => {
    setOpenDemoId(demoId)
    setShellState({})
    closeGuardRef.current = null
  }, [])

  const closeDemo = useCallback(() => {
    setOpenDemoId(null)
    setShellState({})
    closeGuardRef.current = null
  }, [])

  const requestClose = useCallback(() => {
    const guard = closeGuardRef.current
    if (guard) {
      const result = guard()
      if (result === false) return
    }
    closeDemo()
  }, [closeDemo])

  const registerCloseGuard = useCallback((guard: (() => boolean | void) | null) => {
    closeGuardRef.current = guard
  }, [])

  const pushToast = useCallback((message: string, tone: DemoToast['tone'] = 'default') => {
    const id = createToastId()
    setToasts((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3600)
  }, [])

  const resetAllDemos = useCallback(() => {
    clearAllDemoStorage()
    resetAllEffects()
    setShellState({})
    setOpenDemoId(null)
    pushToast('Cleared all demo data.', 'warning')
  }, [pushToast, resetAllEffects])

  const value = useMemo<DemoEngineContextValue>(
    () => ({
      openDemoId,
      registry: demoRegistry,
      openDemo,
      closeDemo,
      requestClose,
      registerCloseGuard,
      shellState,
      setShellState,
      pushToast,
      resetAllDemos,
      toasts,
    }),
    [closeDemo, openDemo, openDemoId, pushToast, requestClose, resetAllDemos, shellState, toasts],
  )

  return (
    <DemoEngineContext.Provider value={value}>
      <EditModeStateProvider>
        <BackgroundLabStateProvider>
          <IndustryStateProvider>
            <DemoEffectsRoot>
              {children}
              <DemoShell />
              <DemoToasts />
            </DemoEffectsRoot>
          </IndustryStateProvider>
        </BackgroundLabStateProvider>
      </EditModeStateProvider>
    </DemoEngineContext.Provider>
  )
}

export default function DemoEngineProvider({ children }: { children: React.ReactNode }) {
  return (
    <DemoEffectsProvider>
      <DemoEngineInner>{children}</DemoEngineInner>
    </DemoEffectsProvider>
  )
}

export const useDemoEngine = () => {
  const context = useContext(DemoEngineContext)
  if (!context) {
    throw new Error('useDemoEngine must be used within DemoEngineProvider')
  }
  return context
}
