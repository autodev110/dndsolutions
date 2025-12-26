'use client'

import { AnimatePresence, motion, useDragControls } from 'framer-motion'
import { GripVertical, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'

const STATUS_STYLES: Record<string, string> = {
  saved: 'bg-emerald-500/15 text-emerald-200 border-emerald-400/30',
  unsaved: 'bg-amber-500/15 text-amber-200 border-amber-400/30',
  live: 'bg-sky-500/15 text-sky-200 border-sky-400/30',
}

export default function DemoShell() {
  const {
    openDemoId,
    registry,
    requestClose,
    shellState,
    resetAllDemos,
  } = useDemoEngine()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const constraintsRef = useRef<HTMLDivElement | null>(null)
  const dragControls = useDragControls()
  const [isDragging, setIsDragging] = useState(false)

  const activeDemo = useMemo(
    () => registry.find((demo) => demo.id === openDemoId),
    [openDemoId, registry],
  )
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.classList.toggle('demo-dragging', isDragging)
    return () => document.body.classList.remove('demo-dragging')
  }, [isDragging])

  if (!activeDemo) return null

  const layout = activeDemo.layout ?? 'side'
  const isEditMode = activeDemo.id === 'edit-mode'
  const canDragPanel = isEditMode && !isMobile
  const status = shellState.status ?? { label: 'Live', tone: 'live' }
  const showSave = shellState.showSave ?? false
  const closeLabel = shellState.closeLabel ?? 'Close'

  const panelClasses = cn(
    'flex w-full flex-col overflow-hidden rounded-3xl border border-white/10 min-h-0 max-h-[calc(100vh-6rem)] max-h-[calc(100svh-6rem)]',
    layout === 'side' && 'max-w-[28rem]',
    layout === 'wide' && 'max-w-5xl',
    layout === 'center' && 'max-w-3xl',
    isMobile && 'max-w-none rounded-t-3xl rounded-b-none',
  )

  const panelMotion = isMobile
    ? { initial: { y: 60, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: 60, opacity: 0 } }
    : layout === 'side'
      ? { initial: { x: 80, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 80, opacity: 0 } }
      : { initial: { scale: 0.98, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.98, opacity: 0 } }

  return (
    <AnimatePresence>
      <motion.div
        key={activeDemo.id}
        ref={constraintsRef}
        className={cn(
          'fixed inset-0 z-[80] flex items-end justify-center px-4 pb-4 pt-20 md:items-center md:pb-8',
          isEditMode && 'pointer-events-none',
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {!isEditMode && (
          <button
            type="button"
            aria-label="Close demo"
            className="absolute inset-0 cursor-pointer bg-[#02040b]/70 backdrop-blur-sm"
            onClick={requestClose}
          />
        )}
        <LiquidGlass
          as={motion.div}
          variant="panel"
          className={cn(
            panelClasses,
            'demo-shell-panel',
            layout === 'side' && 'ml-auto md:mr-6',
            layout !== 'side' && 'mx-auto',
            isEditMode && 'pointer-events-auto',
          )}
          drag={canDragPanel}
          dragListener={false}
          dragConstraints={constraintsRef}
          dragMomentum={false}
          dragElastic={0.12}
          dragControls={dragControls}
          whileDrag={{ scale: 0.99 }}
          onDragStart={() => {
            if (canDragPanel) setIsDragging(true)
          }}
          onDragEnd={() => {
            if (canDragPanel) setIsDragging(false)
          }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          {...panelMotion}
        >
          {canDragPanel && (
            <div
              className="demo-shell-drag-handle"
              onPointerDown={(event) => {
                event.preventDefault()
                event.stopPropagation()
                dragControls.start(event)
              }}
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-text-muted">
                <GripVertical className="h-3.5 w-3.5" />
                Drag Panel
              </div>
            </div>
          )}
          <header className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 shrink-0">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.28em] text-text-muted">
                <span className="text-demo-accent">Demo Engine</span>
                <span className={cn('flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold', STATUS_STYLES[status.tone])}>
                  {status.tone === 'unsaved' && <span className="h-1.5 w-1.5 rounded-full bg-amber-200 animate-pulse" />}
                  {status.label}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-heading text-white">{activeDemo.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{activeDemo.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {showSave && shellState.onSave && (
                <Button size="sm" onClick={shellState.onSave}>
                  Save
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={shellState.onReset}
                disabled={!shellState.onReset}
              >
                Reset
              </Button>
              <Button size="sm" variant="ghost" onClick={requestClose}>
                {closeLabel}
                <X className="h-4 w-4" />
              </Button>
            </div>
          </header>
          <div className={cn('flex-1 min-h-0 overflow-y-auto px-6 py-6', layout !== 'side' && 'py-8')}>
            <activeDemo.Component />
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-4 text-xs text-text-muted shrink-0">
            <span>Demo only - Local state stored in your browser.</span>
            <button
              type="button"
              onClick={resetAllDemos}
              className="text-xs font-semibold text-demo-accent transition hover:text-white"
            >
              Clear Demo Data
            </button>
          </footer>
        </LiquidGlass>
      </motion.div>
    </AnimatePresence>
  )
}
