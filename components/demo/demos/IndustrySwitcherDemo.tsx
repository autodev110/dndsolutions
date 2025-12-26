'use client'

import { useEffect } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { industryProfiles } from '@/lib/demo/industry'
import { useIndustryState } from '@/components/demo/state/IndustryState'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { cn } from '@/lib/utils'

export default function IndustrySwitcherDemo() {
  const { industryId, setIndustryId, reset } = useIndustryState()
  const { setShellState, pushToast } = useDemoEngine()

  useEffect(() => {
    setShellState({
      status: { label: industryId ? 'Active' : 'Live', tone: 'live' },
      onReset: () => {
        reset()
        pushToast('Industry context reset.', 'warning')
      },
      closeLabel: 'Close',
    })
  }, [industryId, pushToast, reset, setShellState])

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Industry Context</p>
        <p className="mt-2 text-sm text-text-secondary">
          Switch industry profiles to re-skin copy, accents, and iconography across the page.
        </p>
      </div>

      <div className="grid gap-3">
        {industryProfiles.map((profile) => {
          const isActive = industryId === profile.id
          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => setIndustryId(profile.id)}
              className={cn(
                'flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left transition',
                isActive && 'border-emerald-400/50',
              )}
            >
              <div className="flex items-center gap-4">
                <span
                  className="h-11 w-11 rounded-2xl border border-white/10"
                  style={{ background: profile.palette.primary }}
                />
                <div>
                  <p className="text-sm font-semibold text-white">{profile.displayName}</p>
                  <p className="text-xs text-text-muted">{profile.description}</p>
                </div>
              </div>
              {isActive && <CheckCircle2 className="h-5 w-5 text-emerald-300" />}
            </button>
          )
        })}
      </div>

      <LiquidGlass variant="dense" className="px-4 py-3 text-xs text-text-muted">
        Demo only - Industry context updates are local and reversible.
      </LiquidGlass>
    </div>
  )
}
