'use client'

import { useMemo, useState } from 'react'
import { GripVertical, MoveDown, MoveUp } from 'lucide-react'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { Button } from '@/components/ui/button'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'
import { useDemoEffects, useDemoEffectsActions } from '@/lib/demo/effects'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { cn } from '@/lib/utils'
import EditableText from '@/components/demo/EditableText'
import IndustryIcon from '@/components/demo/IndustryIcon'
import { useEditModeState } from '@/components/demo/state/EditModeState'

const densityClasses = {
  comfortable: 'gap-5 p-7',
  compact: 'gap-4 p-5',
  spacious: 'gap-6 p-8',
}

const moveItem = (list: string[], fromIndex: number, toIndex: number) => {
  const next = [...list]
  const [removed] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, removed)
  return next
}

export default function DemoCardGrid() {
  const { openDemo, registry } = useDemoEngine()
  const { setLayout } = useDemoEffectsActions()
  const { draft, setDraft, addLogEntry } = useEditModeState()
  const content = useDemoEffects((state) => state.content.effective)
  const layout = useDemoEffects((state) => state.layout)
  const { reorderCards, editModeActive } = useDemoEffects((state) => state.flags)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)

  const mergedCards = useMemo(() => {
    const overrides = new Map(content.demos.cards.map((card) => [card.id, card]))
    return registry.map((demo) => ({ ...demo.card, ...overrides.get(demo.id) }))
  }, [content.demos.cards, registry])

  const orderedCards = useMemo(() => {
    const fallback = mergedCards
    const order = layout.demosOrder
    if (!order?.length) return fallback
    const byId = new Map(fallback.map((card) => [card.id, card]))
    const ordered = order.map((id) => byId.get(id)).filter(Boolean)
    const missing = fallback.filter((card) => !order.includes(card.id))
    return [...(ordered as typeof fallback), ...missing]
  }, [layout.demosOrder, mergedCards])

  const commitOrder = (nextOrder: string[]) => {
    setLayout({ demosOrder: nextOrder })
    setDraft((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        demosOrder: nextOrder,
      },
    }))
    if (editModeActive) {
      addLogEntry('Reordered demo cards')
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {orderedCards.map((card, index) => (
        <LiquidGlass
          key={card.id}
          variant="card"
          className={cn(
            'relative flex flex-col transition-transform duration-300',
            densityClasses[layout.cardDensity],
            reorderCards && !isMobile && 'cursor-grab',
            overId === card.id && reorderCards && 'ring-2 ring-[var(--demo-accent-primary)]',
          )}
          draggable={reorderCards && !isMobile}
          onDragStart={(event) => {
            if (!reorderCards || isMobile) return
            setDraggedId(card.id)
            event.dataTransfer.effectAllowed = 'move'
          }}
          onDragOver={(event) => {
            if (!reorderCards || isMobile) return
            event.preventDefault()
            setOverId(card.id)
          }}
          onDragLeave={() => {
            if (!reorderCards || isMobile) return
            setOverId(null)
          }}
          onDrop={(event) => {
            if (!reorderCards || isMobile) return
            event.preventDefault()
            if (!draggedId || draggedId === card.id) return
            const currentOrder = [...layout.demosOrder]
            const fromIndex = currentOrder.indexOf(draggedId)
            const toIndex = currentOrder.indexOf(card.id)
            if (fromIndex === -1 || toIndex === -1) return
            const nextOrder = moveItem(currentOrder, fromIndex, toIndex)
            commitOrder(nextOrder)
            setDraggedId(null)
            setOverId(null)
          }}
          onDragEnd={() => {
            setDraggedId(null)
            setOverId(null)
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <IndustryIcon iconKey={card.iconKey} className="h-5 w-5" />
              </span>
              <div>
                <EditableText
                  as="h3"
                  value={card.title}
                  className="font-heading text-xl text-white"
                  onCommit={(next) => {
                    setDraft((prev) => ({
                      ...prev,
                      content: {
                        ...prev.content,
                        demos: {
                          ...prev.content.demos,
                          cards: prev.content.demos.cards.map((item) =>
                            item.id === card.id ? { ...item, title: next } : item,
                          ),
                        },
                      },
                    }))
                    addLogEntry(`Edited demo title: ${next}`)
                  }}
                />
                <p className="text-xs uppercase tracking-[0.3em] text-demo-accent">{card.badge}</p>
              </div>
            </div>
            {reorderCards && !isMobile ? (
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-text-muted">
                <GripVertical className="h-4 w-4" />
              </span>
            ) : (
              <span className="text-xs uppercase tracking-widest text-text-muted">Demo</span>
            )}
          </div>
          <EditableText
            as="p"
            value={card.subtitle}
            className="mt-4 text-sm text-text-secondary"
            multiline
            onCommit={(next) => {
              setDraft((prev) => ({
                ...prev,
                content: {
                  ...prev.content,
                  demos: {
                    ...prev.content.demos,
                    cards: prev.content.demos.cards.map((item) =>
                      item.id === card.id ? { ...item, subtitle: next } : item,
                    ),
                  },
                },
              }))
              addLogEntry(`Edited demo description: ${card.title}`)
            }}
          />
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-text-muted">
            {card.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-white/10 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <Button size="sm" onClick={() => openDemo(card.id)}>
              Demo
            </Button>
            {reorderCards && isMobile && (
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <button
                  type="button"
                  onClick={() => {
                    const currentOrder = [...layout.demosOrder]
                    const fromIndex = currentOrder.indexOf(card.id)
                    if (fromIndex <= 0) return
                    commitOrder(moveItem(currentOrder, fromIndex, fromIndex - 1))
                  }}
                  className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1"
                >
                  <MoveUp className="h-3 w-3" />
                  Up
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currentOrder = [...layout.demosOrder]
                    const fromIndex = currentOrder.indexOf(card.id)
                    if (fromIndex === -1 || fromIndex >= currentOrder.length - 1) return
                    commitOrder(moveItem(currentOrder, fromIndex, fromIndex + 1))
                  }}
                  className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1"
                >
                  <MoveDown className="h-3 w-3" />
                  Down
                </button>
              </div>
            )}
          </div>
        </LiquidGlass>
      ))}
    </div>
  )
}
