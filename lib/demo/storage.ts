import { DEMO_SCHEMA_VERSION, DEMO_STORAGE_PREFIX } from './constants'
import type { DemoId } from './demoData'

export type DemoStorageKind = 'draft' | 'saved' | 'meta'

export type DemoStorageMeta = {
  schemaVersion: number
  lastSavedAt?: number
  lastEditedAt?: number
}

const getStorageKey = (demoId: DemoId, kind: DemoStorageKind) =>
  `${DEMO_STORAGE_PREFIX}:${demoId}:${kind}:v${DEMO_SCHEMA_VERSION}`

export const readDemoStorage = <T>(demoId: DemoId, kind: DemoStorageKind): T | null => {
  if (typeof window === 'undefined') return null
  const key = getStorageKey(demoId, kind)
  const raw = window.localStorage.getItem(key)
  if (!raw) return null
  try {
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

export const writeDemoStorage = <T>(demoId: DemoId, kind: DemoStorageKind, value: T) => {
  if (typeof window === 'undefined') return
  const key = getStorageKey(demoId, kind)
  window.localStorage.setItem(key, JSON.stringify(value))
}

export const removeDemoStorage = (demoId: DemoId) => {
  if (typeof window === 'undefined') return
  ;(['draft', 'saved', 'meta'] as DemoStorageKind[]).forEach((kind) => {
    window.localStorage.removeItem(getStorageKey(demoId, kind))
  })
}

export const clearAllDemoStorage = () => {
  if (typeof window === 'undefined') return
  const keysToRemove: string[] = []
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i)
    if (!key) continue
    if (key.startsWith(`${DEMO_STORAGE_PREFIX}:`)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => window.localStorage.removeItem(key))
}
