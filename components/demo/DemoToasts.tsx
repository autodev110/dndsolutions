'use client'

import { AnimatePresence, motion } from 'framer-motion'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { cn } from '@/lib/utils'
import { useDemoEngine } from '@/components/demo/DemoEngineProvider'

const toneClasses: Record<string, string> = {
  default: 'text-text-secondary',
  success: 'text-emerald-200',
  warning: 'text-amber-200',
}

export default function DemoToasts() {
  const { toasts } = useDemoEngine()

  if (!toasts.length) return null

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <LiquidGlass
            as={motion.div}
            key={toast.id}
            variant="chip"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className={cn('px-4 py-2 text-xs', toneClasses[toast.tone ?? 'default'])}
          >
            {toast.message}
          </LiquidGlass>
        ))}
      </AnimatePresence>
    </div>
  )
}
