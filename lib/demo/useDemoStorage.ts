'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { DemoId } from './demoData'
import { DEMO_SCHEMA_VERSION } from './constants'
import type { DemoStorageMeta } from './storage'
import { readDemoStorage, removeDemoStorage, writeDemoStorage } from './storage'
import { deepEqual } from './utils'

type UseDemoStorageOptions = {
  enableSave?: boolean
  debounceMs?: number
}

type DraftUpdater<T> = T | ((prev: T) => T)

export const useDemoStorage = <T,>(demoId: DemoId, defaultState: T, options: UseDemoStorageOptions = {}) => {
  const { enableSave = false, debounceMs = 300 } = options
  const [draft, setDraftState] = useState<T>(defaultState)
  const [saved, setSaved] = useState<T | null>(null)
  const [meta, setMeta] = useState<DemoStorageMeta>({ schemaVersion: DEMO_SCHEMA_VERSION })
  const [hydrated, setHydrated] = useState(false)
  const debounceRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedMeta = readDemoStorage<DemoStorageMeta>(demoId, 'meta')
    if (!storedMeta || storedMeta.schemaVersion !== DEMO_SCHEMA_VERSION) {
      removeDemoStorage(demoId)
      setDraftState(defaultState)
      setSaved(null)
      setMeta({ schemaVersion: DEMO_SCHEMA_VERSION })
      setHydrated(true)
      return
    }

    const storedDraft = readDemoStorage<T>(demoId, 'draft')
    const storedSaved = readDemoStorage<T>(demoId, 'saved')

    setDraftState(storedDraft ?? storedSaved ?? defaultState)
    setSaved(storedSaved ?? null)
    setMeta(storedMeta)
    setHydrated(true)
  }, [defaultState, demoId])

  const setDraft = useCallback((updater: DraftUpdater<T>) => {
    setDraftState((prev) => (typeof updater === 'function' ? (updater as (prev: T) => T)(prev) : updater))
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current)
    }

    debounceRef.current = window.setTimeout(() => {
      writeDemoStorage(demoId, 'draft', draft)
      setMeta((prev) => {
        const nextMeta: DemoStorageMeta = {
          ...prev,
          schemaVersion: DEMO_SCHEMA_VERSION,
          lastEditedAt: Date.now(),
        }
        writeDemoStorage(demoId, 'meta', nextMeta)
        return nextMeta
      })
    }, debounceMs)

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current)
      }
    }
  }, [demoId, debounceMs, draft, hydrated])

  const save = useCallback(() => {
    if (!enableSave) return
    setSaved(draft)
    writeDemoStorage(demoId, 'saved', draft)
    setMeta((prev) => {
      const nextMeta: DemoStorageMeta = {
        ...prev,
        schemaVersion: DEMO_SCHEMA_VERSION,
        lastSavedAt: Date.now(),
      }
      writeDemoStorage(demoId, 'meta', nextMeta)
      return nextMeta
    })
  }, [demoId, draft, enableSave])

  const reset = useCallback(
    (clearSaved = true) => {
      setDraftState(defaultState)
      writeDemoStorage(demoId, 'draft', defaultState)
      if (clearSaved) {
        setSaved(null)
        writeDemoStorage(demoId, 'saved', null)
      }
      setMeta((prev) => {
        const nextMeta: DemoStorageMeta = {
          ...prev,
          schemaVersion: DEMO_SCHEMA_VERSION,
          lastEditedAt: Date.now(),
        }
        writeDemoStorage(demoId, 'meta', nextMeta)
        return nextMeta
      })
    },
    [defaultState, demoId],
  )

  const clear = useCallback(() => {
    removeDemoStorage(demoId)
    setDraftState(defaultState)
    setSaved(null)
    setMeta({ schemaVersion: DEMO_SCHEMA_VERSION })
  }, [defaultState, demoId])

  const isDirty = useMemo(() => {
    if (!enableSave) return false
    const baseline = saved ?? defaultState
    return !deepEqual(draft, baseline)
  }, [defaultState, draft, enableSave, saved])

  return {
    draft,
    setDraft,
    saved,
    meta,
    save,
    reset,
    clear,
    hydrated,
    isDirty,
  }
}
