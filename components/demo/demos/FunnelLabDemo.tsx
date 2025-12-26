'use client'

import { useEffect, useMemo } from 'react'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'
import { useDemoStorage } from '@/lib/demo/useDemoStorage'
import { useDemoEffects } from '@/lib/demo/effects'
import AnimatedNumber from '@/components/demo/AnimatedNumber'
import { cn } from '@/lib/utils'

const DEFAULT_FUNNEL_STATE = {
  traffic: 12000,
  conversionRate: 2.4,
  aov: 180,
  cpc: 2.1,
  closeRate: 24,
  mode: 'before' as 'before' | 'dnd',
}

const TRAFFIC_MIN = 500
const TRAFFIC_MAX = 200000

const trafficToSlider = (traffic: number) =>
  Math.round((Math.log(traffic / TRAFFIC_MIN) / Math.log(TRAFFIC_MAX / TRAFFIC_MIN)) * 100)

const sliderToTraffic = (value: number) =>
  Math.round(TRAFFIC_MIN * Math.pow(TRAFFIC_MAX / TRAFFIC_MIN, value / 100))

const formatNumber = (value: number) => value.toLocaleString('en-US')
const formatCurrency = (value: number) =>
  `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`

const formatPercent = (value: number) => `${value.toFixed(2)}%`

const computeImprovement = (state: typeof DEFAULT_FUNNEL_STATE) => {
  const cr = state.conversionRate
  const crMultiplier = cr < 1 ? 1.6 : cr < 3 ? 1.35 : 1.2
  const aovMultiplier = state.aov < 120 ? 1.18 : 1.12
  const trafficMultiplier = state.traffic < 5000 ? 1.45 : state.traffic < 50000 ? 1.22 : 1.12
  const cpcMultiplier = state.cpc > 0 ? (cr < 1 ? 0.8 : 0.88) : 1
  const closeMultiplier = state.closeRate < 20 ? 1.2 : 1.1

  return {
    traffic: state.traffic * trafficMultiplier,
    conversionRate: state.conversionRate * crMultiplier,
    aov: state.aov * aovMultiplier,
    cpc: state.cpc * cpcMultiplier,
    closeRate: state.closeRate * closeMultiplier,
    multipliers: {
      traffic: trafficMultiplier,
      conversionRate: crMultiplier,
      aov: aovMultiplier,
      cpc: cpcMultiplier,
      closeRate: closeMultiplier,
    },
  }
}

export default function FunnelLabDemo() {
  const { setShellState, pushToast } = useDemoEngine()
  const labels = useDemoEffects((state) => state.labels)
  const { draft, setDraft, reset } = useDemoStorage('funnel-lab', DEFAULT_FUNNEL_STATE, { debounceMs: 180 })

  useEffect(() => {
    setShellState({
      status: { label: 'Live', tone: 'live' },
      onReset: () => {
        reset()
        pushToast('Reset to baseline.', 'warning')
      },
      closeLabel: 'Close',
    })
  }, [pushToast, reset, setShellState])

  const improvement = useMemo(() => computeImprovement(draft), [draft])
  const effective = draft.mode === 'dnd'
    ? {
        ...draft,
        ...improvement,
      }
    : draft

  const leads = effective.traffic * (effective.conversionRate / 100)
  const customers = leads * (effective.closeRate / 100)
  const revenue = customers * effective.aov
  const spend = effective.traffic * effective.cpc
  const roas = spend > 0 ? revenue / spend : 0

  const qualityScore = Math.max(0, Math.min(1, (effective.conversionRate / 12 + effective.aov / 2000 + (1 - effective.cpc / 15)) / 3))
  const qualityLabel = qualityScore > 0.7 ? 'High Intent' : qualityScore > 0.45 ? 'Mixed' : 'Low Intent'

  const funnelStages = [
    { label: 'Visitors', value: effective.traffic },
    { label: labels.leads, value: leads },
    { label: 'Customers', value: customers },
  ]

  const maxStage = Math.max(...funnelStages.map((stage) => stage.value))

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-5">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.2em] text-text-muted">
          Simulator - Illustrative
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Scenario</p>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, mode: 'before' }))}
                className={cn('rounded-full px-3 py-1 text-xs', draft.mode === 'before' ? 'bg-white/10 text-white' : 'text-text-muted')}
              >
                Before
              </button>
              <button
                type="button"
                onClick={() => setDraft((prev) => ({ ...prev, mode: 'dnd' }))}
                className={cn('rounded-full px-3 py-1 text-xs', draft.mode === 'dnd' ? 'bg-white/10 text-white' : 'text-text-muted')}
              >
                DnD's Solution
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Traffic (sessions/mo)</span>
                {draft.mode === 'dnd' && (
                  <span className="text-emerald-200">+{Math.round((improvement.multipliers.traffic - 1) * 100)}%</span>
                )}
              </div>
              <input
                className="demo-slider mt-2"
                type="range"
                min={0}
                max={100}
                value={trafficToSlider(draft.traffic)}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    traffic: sliderToTraffic(Number(event.target.value)),
                  }))
                }
              />
              <p className="mt-2 text-sm text-white">{formatNumber(draft.traffic)}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Conversion Rate</span>
                {draft.mode === 'dnd' && (
                  <span className="text-emerald-200">+{Math.round((improvement.multipliers.conversionRate - 1) * 100)}%</span>
                )}
              </div>
              <input
                className="demo-slider mt-2"
                type="range"
                min={0.2}
                max={12}
                step={0.1}
                value={draft.conversionRate}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    conversionRate: Number(event.target.value),
                  }))
                }
              />
              <p className="mt-2 text-sm text-white">{formatPercent(draft.conversionRate)}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>AOV</span>
                {draft.mode === 'dnd' && (
                  <span className="text-emerald-200">+{Math.round((improvement.multipliers.aov - 1) * 100)}%</span>
                )}
              </div>
              <input
                className="demo-slider mt-2"
                type="range"
                min={25}
                max={2000}
                step={5}
                value={draft.aov}
                onChange={(event) => setDraft((prev) => ({ ...prev, aov: Number(event.target.value) }))}
              />
              <p className="mt-2 text-sm text-white">${draft.aov.toFixed(0)}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>CPC</span>
                {draft.mode === 'dnd' && (
                  <span className="text-emerald-200">{Math.round((1 - improvement.multipliers.cpc) * 100)}% down</span>
                )}
              </div>
              <input
                className="demo-slider mt-2"
                type="range"
                min={0.5}
                max={15}
                step={0.1}
                value={draft.cpc}
                onChange={(event) => setDraft((prev) => ({ ...prev, cpc: Number(event.target.value) }))}
              />
              <p className="mt-2 text-sm text-white">${draft.cpc.toFixed(2)}</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-text-muted">
                <span>Lead-to-Customer Close Rate</span>
                {draft.mode === 'dnd' && (
                  <span className="text-emerald-200">+{Math.round((improvement.multipliers.closeRate - 1) * 100)}%</span>
                )}
              </div>
              <input
                className="demo-slider mt-2"
                type="range"
                min={5}
                max={60}
                step={1}
                value={draft.closeRate}
                onChange={(event) => setDraft((prev) => ({ ...prev, closeRate: Number(event.target.value) }))}
              />
              <p className="mt-2 text-sm text-white">{draft.closeRate.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-3">
          <LiquidGlass variant="card" className="space-y-2 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-text-muted">{labels.revenue}</p>
            <p className="text-3xl font-heading text-white">
              <AnimatedNumber value={revenue} format={formatCurrency} />
            </p>
            {draft.mode === 'dnd' && (
              <p className="text-xs text-emerald-200">+ uplift scenario</p>
            )}
          </LiquidGlass>
          <div className="grid gap-3 md:grid-cols-2">
            <LiquidGlass variant="card" className="space-y-2 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">{labels.leads}</p>
              <p className="text-xl font-heading text-white">
                <AnimatedNumber value={leads} format={(value) => formatNumber(Math.round(value))} />
              </p>
            </LiquidGlass>
            <LiquidGlass variant="card" className="space-y-2 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Customers</p>
              <p className="text-xl font-heading text-white">
                <AnimatedNumber value={customers} format={(value) => formatNumber(Math.round(value))} />
              </p>
            </LiquidGlass>
            <LiquidGlass variant="card" className="space-y-2 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">Ad Spend</p>
              <p className="text-xl font-heading text-white">
                <AnimatedNumber value={spend} format={formatCurrency} />
              </p>
            </LiquidGlass>
            <LiquidGlass variant="card" className="space-y-2 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-text-muted">ROAS</p>
              <p className="text-xl font-heading text-white">
                <AnimatedNumber value={roas} format={(value) => `${value.toFixed(2)}x`} />
              </p>
            </LiquidGlass>
          </div>
        </div>

        <LiquidGlass variant="panel" className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Lead Quality</p>
            <span className="text-xs uppercase tracking-[0.2em] text-demo-accent">{qualityLabel}</span>
          </div>
          <div className="space-y-2">
            {funnelStages.map((stage) => (
              <div key={stage.label}>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span>{stage.label}</span>
                  <span>{formatNumber(Math.round(stage.value))}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-white/10">
                  <div
                    className="h-2 rounded-full bg-demo-accent transition-all duration-500"
                    style={{ width: `${Math.max(6, (stage.value / maxStage) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </LiquidGlass>

        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-text-muted">
          Illustrative simulator - Estimates depend on traffic quality and funnel design.
        </div>

        {draft.mode === 'dnd' && (
          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <TrendingUp className="h-4 w-4" />
            Lift applied - UX friction reduced, offer clarity improved.
            <ArrowUpRight className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  )
}
