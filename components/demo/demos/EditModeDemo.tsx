'use client'

import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronUp, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'
import { useEditModeState } from '@/components/demo/state/EditModeState'
import { DEFAULT_EDIT_MODE_DRAFT } from '@/lib/demo/editMode'
import type { GlassStyle } from '@/lib/demo/glass'
import type { CardDensity, HeroVariant, SpacingDensity } from '@/lib/demo/effects'
import { formatClockTime } from '@/lib/demo/utils'
import { cn } from '@/lib/utils'

const spacingOptions: SpacingDensity[] = ['compact', 'normal', 'spacious']
const densityOptions: CardDensity[] = ['compact', 'comfortable', 'spacious']
const heroVariants: HeroVariant[] = ['classic', 'split', 'centered', 'dense']
const glassStyles: GlassStyle[] = ['liquid', 'frosted']

const sectionLabels = [
  { id: 'outcomes', label: 'Outcome Panels' },
  { id: 'services', label: 'Services Grid' },
  { id: 'demos', label: 'Components & Demos' },
  { id: 'cta', label: 'Project CTA' },
]

type ToggleRowProps = {
  label: string
  description: string
  checked: boolean
  onChange: () => void
}

const ToggleRow = ({ label, description, checked, onChange }: ToggleRowProps) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
    <div>
      <p className="text-sm font-semibold text-white">{label}</p>
      <p className="text-xs text-text-muted">{description}</p>
    </div>
    <button
      type="button"
      onClick={onChange}
      className={cn(
        'relative h-7 w-12 rounded-full border border-white/10 transition',
        checked ? 'bg-emerald-400/40' : 'bg-white/10',
      )}
      aria-pressed={checked}
    >
      <span
        className={cn(
          'absolute top-1 h-5 w-5 rounded-full bg-white transition',
          checked ? 'left-6' : 'left-1',
        )}
      />
    </button>
  </div>
)

const moveItem = (list: string[], from: number, to: number) => {
  const next = [...list]
  const [removed] = next.splice(from, 1)
  next.splice(to, 0, removed)
  return next
}

export default function EditModeDemo() {
  const { setShellState, registerCloseGuard, closeDemo, pushToast } = useDemoEngine()
  const { draft, setDraft, saved, save, reset, isDirty, addLogEntry } = useEditModeState()
  const [showExitConfirm, setShowExitConfirm] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    setShellState({
      status: {
        label: isDirty ? 'Unsaved changes' : 'Saved',
        tone: isDirty ? 'unsaved' : 'saved',
      },
      showSave: true,
      onSave: () => {
        save()
        pushToast('Saved locally (demo).', 'success')
      },
      onReset: () => {
        setIsResetting(true)
        reset()
        addLogEntry('Reset to defaults')
        pushToast('Reset to defaults.', 'warning')
        window.setTimeout(() => setIsResetting(false), 650)
      },
      closeLabel: 'Exit',
    })
  }, [addLogEntry, isDirty, pushToast, reset, save, setShellState])

  useEffect(() => {
    registerCloseGuard(() => {
      if (!isDirty) return true
      setShowExitConfirm(true)
      return false
    })

    return () => registerCloseGuard(null)
  }, [isDirty, registerCloseGuard])

  const spacingIndex = spacingOptions.indexOf(draft.layout.spacingDensity)
  const orderedSections = useMemo(() => {
    const current = draft.layout.sectionsOrder.length
      ? draft.layout.sectionsOrder
      : DEFAULT_EDIT_MODE_DRAFT.layout.sectionsOrder
    const byId = new Map(sectionLabels.map((item) => [item.id, item.label]))
    return current.map((id) => ({ id, label: byId.get(id) ?? id }))
  }, [draft.layout.sectionsOrder])

  const handleDiscard = () => {
    setShowExitConfirm(false)
    setDraft(saved ?? DEFAULT_EDIT_MODE_DRAFT)
    closeDemo()
  }

  return (
    <div className="relative space-y-6">
      {isResetting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-demo-accent">
            <RotateCcw className="h-4 w-4" /> Resetting
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.28em] text-text-muted">Builder controls - local demo only</p>
        <p className="mt-2 text-sm text-text-secondary">
          Adjust inline copy, layout density, and structure. All changes are local and reversible.
        </p>
      </div>

      <section className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Content Tools</h4>
        <ToggleRow
          label="Inline Text Editing"
          description="Click highlighted copy blocks to edit in place."
          checked={draft.flags.inlineEditing}
          onChange={() => {
            setDraft((prev) => ({
              ...prev,
              flags: { ...prev.flags, inlineEditing: !prev.flags.inlineEditing },
            }))
            addLogEntry('Toggled inline text editing')
          }}
        />
        <ToggleRow
          label="Show Editable Regions"
          description="Reveal which text fields are editable."
          checked={draft.flags.showEditableRegions}
          onChange={() => {
            setDraft((prev) => ({
              ...prev,
              flags: { ...prev.flags, showEditableRegions: !prev.flags.showEditableRegions },
            }))
            addLogEntry('Toggled editable region overlay')
          }}
        />
        <ToggleRow
          label="Outline Components"
          description="Highlight layout panels and cards for clarity."
          checked={draft.flags.outlineComponents}
          onChange={() => {
            setDraft((prev) => ({
              ...prev,
              flags: { ...prev.flags, outlineComponents: !prev.flags.outlineComponents },
            }))
            addLogEntry('Toggled component outlines')
          }}
        />
      </section>

      <section className="space-y-4">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Layout Tools</h4>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-sm font-semibold text-white">Hero Variant</p>
          <Select
            value={draft.layout.heroVariant}
            onValueChange={(value) => {
              setDraft((prev) => ({
                ...prev,
                layout: { ...prev.layout, heroVariant: value as HeroVariant },
              }))
              addLogEntry(`Changed hero variant: ${value}`)
            }}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select variant" />
            </SelectTrigger>
            <SelectContent>
              {heroVariants.map((variant) => (
                <SelectItem key={variant} value={variant}>
                  {variant}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Section Spacing</p>
            <span className="text-xs uppercase tracking-[0.2em] text-text-muted">
              {draft.layout.spacingDensity}
            </span>
          </div>
          <input
            className="demo-slider"
            type="range"
            min={0}
            max={2}
            step={1}
            value={spacingIndex}
            onChange={(event) => {
              const value = spacingOptions[Number(event.target.value)]
              setDraft((prev) => ({
                ...prev,
                layout: { ...prev.layout, spacingDensity: value },
              }))
              addLogEntry(`Changed spacing: ${value}`)
            }}
          />
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-muted">
            <span>Compact</span>
            <span>Normal</span>
            <span>Spacious</span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-sm font-semibold text-white">Card Density</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {densityOptions.map((density) => (
              <button
                key={density}
                type="button"
                onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    layout: { ...prev.layout, cardDensity: density },
                  }))
                  addLogEntry(`Changed card density: ${density}`)
                }}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition',
                  density === draft.layout.cardDensity
                    ? 'border-emerald-400/60 text-emerald-200'
                    : 'border-white/10 text-text-muted hover:text-white',
                )}
              >
                {density}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Surface Tools</h4>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <p className="text-sm font-semibold text-white">Glass Style</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {glassStyles.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => {
                  setDraft((prev) => ({
                    ...prev,
                    glass: { ...prev.glass, style },
                  }))
                  addLogEntry(`Changed glass style: ${style}`)
                }}
                className={cn(
                  'rounded-full border px-4 py-2 text-xs uppercase tracking-[0.24em] transition',
                  style === draft.glass.style
                    ? 'border-emerald-400/60 text-emerald-200'
                    : 'border-white/10 text-text-muted hover:text-white',
                )}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Glass Transparency</p>
            <span className="text-xs uppercase tracking-[0.2em] text-text-muted">
              {Math.round(draft.glass.opacity * 100)}%
            </span>
          </div>
          <input
            className="demo-slider"
            type="range"
            min={0.35}
            max={1}
            step={0.05}
            value={draft.glass.opacity}
            onChange={(event) => {
              const value = Number(event.target.value)
              setDraft((prev) => ({
                ...prev,
                glass: { ...prev.glass, opacity: value },
              }))
              addLogEntry(`Adjusted glass transparency: ${Math.round(value * 100)}%`)
            }}
          />
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-muted">
            <span>Soft</span>
            <span>Clear</span>
          </div>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Glass Tint</p>
            <span className="text-xs uppercase tracking-[0.2em] text-text-muted">
              {draft.glass.tintShift >= 0 ? '+' : ''}
              {draft.glass.tintShift}deg
            </span>
          </div>
          <input
            className="demo-slider"
            type="range"
            min={-80}
            max={80}
            step={4}
            value={draft.glass.tintShift}
            onChange={(event) => {
              const value = Number(event.target.value)
              setDraft((prev) => ({
                ...prev,
                glass: { ...prev.glass, tintShift: value },
              }))
              addLogEntry(`Adjusted glass tint: ${value}deg`)
            }}
          />
          <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-muted">
            <span>Cool</span>
            <span>Warm</span>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Structure Tools</h4>
        <ToggleRow
          label="Reorder Sections"
          description="Drag major page sections to rearrange the layout."
          checked={draft.flags.reorderSections}
          onChange={() => {
            setDraft((prev) => ({
              ...prev,
              flags: { ...prev.flags, reorderSections: !prev.flags.reorderSections },
            }))
            addLogEntry('Toggled section reordering')
          }}
        />
        <ToggleRow
          label="Reorder Cards"
          description="Drag demo cards to rearrange the grid."
          checked={draft.flags.reorderCards}
          onChange={() => {
            setDraft((prev) => ({
              ...prev,
              flags: { ...prev.flags, reorderCards: !prev.flags.reorderCards },
            }))
            addLogEntry('Toggled card reordering')
          }}
        />

        {draft.flags.reorderSections && (
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            {orderedSections.map((section, index) => (
              <div key={section.id} className="flex items-center justify-between text-sm text-text-secondary">
                <span>{section.label}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (index === 0) return
                      setDraft((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          sectionsOrder: moveItem(prev.layout.sectionsOrder, index, index - 1),
                        },
                      }))
                      addLogEntry(`Moved section: ${section.label}`)
                    }}
                    className="rounded-full border border-white/10 p-2 hover:text-white"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (index === orderedSections.length - 1) return
                      setDraft((prev) => ({
                        ...prev,
                        layout: {
                          ...prev.layout,
                          sectionsOrder: moveItem(prev.layout.sectionsOrder, index, index + 1),
                        },
                      }))
                      addLogEntry(`Moved section: ${section.label}`)
                    }}
                    className="rounded-full border border-white/10 p-2 hover:text-white"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h4 className="text-xs uppercase tracking-[0.28em] text-text-muted">Change Log</h4>
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
          {draft.changeLog.length ? (
            draft.changeLog.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between text-xs text-text-secondary">
                <span>{entry.label}</span>
                <span className="text-text-muted">{formatClockTime(new Date(entry.timestamp))}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-text-muted">No edits yet. Start tweaking to see live actions.</p>
          )}
        </div>
      </section>

      {showExitConfirm && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#060a15] p-6 text-center">
            <p className="text-sm text-white">Discard unsaved changes?</p>
            <p className="mt-2 text-xs text-text-muted">
              Your draft edits are local-only. Exiting now will revert to the last saved state.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Button size="sm" variant="outline" onClick={() => setShowExitConfirm(false)}>
                Stay
              </Button>
              <Button size="sm" onClick={handleDiscard}>
                Discard Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
