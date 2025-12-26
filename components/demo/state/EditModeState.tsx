'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { EditModeDraft, EditModeLogEntry } from '@/lib/demo/editMode'
import { DEFAULT_EDIT_MODE_DRAFT, DEFAULT_EDIT_MODE_FLAGS } from '@/lib/demo/editMode'
import { DEFAULT_GLASS_SETTINGS } from '@/lib/demo/glass'
import { DEFAULT_LAYOUT } from '@/lib/demo/layout'
import { useDemoEffectsActions } from '@/lib/demo/effects'
import { useDemoStorage } from '@/lib/demo/useDemoStorage'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'

const createLogEntry = (label: string): EditModeLogEntry => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  label,
  timestamp: Date.now(),
})

type EditModeStateValue = {
  draft: EditModeDraft
  saved: EditModeDraft | null
  setDraft: (updater: EditModeDraft | ((prev: EditModeDraft) => EditModeDraft)) => void
  save: () => void
  reset: () => void
  isDirty: boolean
  hydrated: boolean
  addLogEntry: (label: string) => void
}

const EditModeContext = createContext<EditModeStateValue | null>(null)

export function EditModeStateProvider({ children }: { children: React.ReactNode }) {
  const { openDemoId } = useDemoEngine()
  const isActive = openDemoId === 'edit-mode'
  const { setEditModeOverride, setLayout, setFlags, setGlass } = useDemoEffectsActions()
  const { draft, setDraft, saved, save, reset, isDirty, hydrated } = useDemoStorage<EditModeDraft>(
    'edit-mode',
    DEFAULT_EDIT_MODE_DRAFT,
    { enableSave: true, debounceMs: 220 },
  )

  useEffect(() => {
    const activeContent = isActive ? draft.content : saved?.content ?? null
    setEditModeOverride(activeContent)
  }, [draft.content, isActive, saved?.content, setEditModeOverride])

  useEffect(() => {
    const nextLayout = isActive ? draft.layout : saved?.layout ?? DEFAULT_LAYOUT
    setLayout(nextLayout)
  }, [draft.layout, isActive, saved?.layout, setLayout])

  useEffect(() => {
    const nextGlass = isActive ? draft.glass : saved?.glass ?? DEFAULT_GLASS_SETTINGS
    setGlass(nextGlass)
  }, [draft.glass, isActive, saved?.glass, setGlass])

  useEffect(() => {
    const nextFlags = isActive ? draft.flags : DEFAULT_EDIT_MODE_FLAGS
    setFlags({
      editModeActive: isActive,
      inlineEditing: nextFlags.inlineEditing,
      showEditableRegions: nextFlags.showEditableRegions,
      outlineComponents: nextFlags.outlineComponents,
      reorderCards: isActive ? nextFlags.reorderCards : false,
      reorderSections: isActive ? nextFlags.reorderSections : false,
    })
  }, [draft.flags, isActive, setFlags])

  const addLogEntry = (label: string) => {
    setDraft((prev) => ({
      ...prev,
      changeLog: [createLogEntry(label), ...prev.changeLog].slice(0, 6),
    }))
  }

  const value = useMemo(
    () => ({
      draft,
      saved,
      setDraft,
      save,
      reset: () => reset(true),
      isDirty,
      hydrated,
      addLogEntry,
    }),
    [draft, saved, setDraft, save, reset, isDirty, hydrated],
  )

  return <EditModeContext.Provider value={value}>{children}</EditModeContext.Provider>
}

export const useEditModeState = () => {
  const context = useContext(EditModeContext)
  if (!context) {
    throw new Error('useEditModeState must be used within EditModeStateProvider')
  }
  return context
}
