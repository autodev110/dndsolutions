'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { IndustryId } from '@/lib/demo/industry'
import { industryProfiles } from '@/lib/demo/industry'
import { useDemoEffectsActions } from '@/lib/demo/effects'
import { useDemoStorage } from '@/lib/demo/useDemoStorage'

type IndustryStateValue = {
  industryId: IndustryId | null
  setIndustryId: (id: IndustryId | null) => void
  reset: () => void
  hydrated: boolean
}

const IndustryStateContext = createContext<IndustryStateValue | null>(null)

const getProfile = (id: IndustryId | null) => {
  if (!id) return null
  return industryProfiles.find((profile) => profile.id === id) ?? null
}

export function IndustryStateProvider({ children }: { children: React.ReactNode }) {
  const { setIndustryProfile } = useDemoEffectsActions()
  const { draft, setDraft, reset, hydrated } = useDemoStorage<IndustryId | null>(
    'industry-switcher',
    null,
    { debounceMs: 200 },
  )

  useEffect(() => {
    if (!hydrated) return
    setIndustryProfile(getProfile(draft))
  }, [draft, hydrated, setIndustryProfile])

  const value = useMemo(
    () => ({
      industryId: draft,
      setIndustryId: setDraft,
      reset: () => reset(true),
      hydrated,
    }),
    [draft, reset, hydrated, setDraft],
  )

  return <IndustryStateContext.Provider value={value}>{children}</IndustryStateContext.Provider>
}

export const useIndustryState = () => {
  const context = useContext(IndustryStateContext)
  if (!context) {
    throw new Error('useIndustryState must be used within IndustryStateProvider')
  }
  return context
}
