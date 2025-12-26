'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { GripVertical } from 'lucide-react'
import ServiceShowcase from '@/components/home/ServiceShowcase'
import LiquidGlass from '@/components/ui/LiquidGlass'
import { Button } from '@/components/ui/button'
import DemoCardGrid from '@/components/demo/DemoCardGrid'
import EditableText from '@/components/demo/EditableText'
import { useDemoEffects, useDemoEffectsActions } from '@/lib/demo/effects'
import { cn } from '@/lib/utils'
import { useEditModeState } from '@/components/demo/state/EditModeState'

const outcomes = [
  {
    title: 'Technical Stack View',
    bullets: [
      'Modern full-stack JS frameworks with scalable, secure SQL backends',
      'Automation pipelines, bots, and cross-system integrations',
      'Custom dashboards, admin tools, and secure operational interfaces',
    ],
  },
  {
    title: 'Business Impact View',
    bullets: [
      'Outcome-driven systems designed to support measurable growth',
      'Streamlined operations across teams, tools, and workflows',
      'Scalable infrastructure enabling rapid testing and iteration',
    ],
  },
]

const spacingMap = {
  compact: 'space-y-16',
  normal: 'space-y-24',
  spacious: 'space-y-32',
}

const heroVariants = {
  classic: {
    container: 'items-center text-center',
    minHeight: 'min-h-[80vh]',
    headline: 'md:text-6xl',
    subhead: 'text-lg',
    copyWidth: 'max-w-2xl',
    copyAlign: 'mx-auto',
    cta: 'items-center justify-center',
  },
  split: {
    container: 'items-start text-left',
    minHeight: 'min-h-[72vh]',
    headline: 'md:text-5xl',
    subhead: 'text-lg',
    copyWidth: 'max-w-xl',
    copyAlign: 'mx-0',
    cta: 'items-start justify-start',
  },
  centered: {
    container: 'items-center text-center',
    minHeight: 'min-h-[86vh]',
    headline: 'md:text-7xl',
    subhead: 'text-xl',
    copyWidth: 'max-w-3xl',
    copyAlign: 'mx-auto',
    cta: 'items-center justify-center',
  },
  dense: {
    container: 'items-center text-center',
    minHeight: 'min-h-[68vh]',
    headline: 'md:text-5xl',
    subhead: 'text-base',
    copyWidth: 'max-w-xl',
    copyAlign: 'mx-auto',
    cta: 'items-center justify-center',
  },
}

const moveItem = (list: string[], fromIndex: number, toIndex: number) => {
  const next = [...list]
  const [removed] = next.splice(fromIndex, 1)
  next.splice(toIndex, 0, removed)
  return next
}

export default function HomePage() {
  const content = useDemoEffects((state) => state.content.effective)
  const layout = useDemoEffects((state) => state.layout)
  const { reorderSections } = useDemoEffects((state) => state.flags)
  const { setLayout } = useDemoEffectsActions()
  const { setDraft, addLogEntry } = useEditModeState()
  const heroVariant = heroVariants[layout.heroVariant] ?? heroVariants.classic
  const spacingClass = spacingMap[layout.spacingDensity] ?? spacingMap.normal
  const [draggedSection, setDraggedSection] = useState<string | null>(null)
  const [overSection, setOverSection] = useState<string | null>(null)

  const sections = useMemo(
    () => [
      {
        id: 'outcomes',
        element: (
          <section className="grid gap-8 lg:grid-cols-2">
            {outcomes.map((view) => (
              <LiquidGlass key={view.title} variant="panel" className="p-9 transition-transform duration-300">
                <p className="text-xs uppercase tracking-[0.4em] text-demo-accent">{view.title}</p>
                <h3 className="mt-4 font-heading text-3xl text-white">
                  {view.title === 'Technical Stack View' ? 'Engineering-first perspective' : 'Outcome-focused blueprint'}
                </h3>
                <ul className="mt-6 space-y-3 text-sm text-text-secondary">
                  {view.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-demo-accent" />
                      {bullet}
                    </li>
                  ))}
                </ul>
              </LiquidGlass>
            ))}
          </section>
        ),
      },
      {
        id: 'services',
        element: (
          <div id="services">
            <ServiceShowcase />
          </div>
        ),
      },
      {
        id: 'demos',
        element: (
          <section id="demos" className="space-y-8">
            <div className="flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.3em] text-demo-accent">Components & Demos</p>
              <EditableText
                as="h2"
                value={content.demos.sectionTitle}
                className="font-heading text-4xl text-white"
                onCommit={(next) => {
                  setDraft((prev) => ({
                    ...prev,
                    content: {
                      ...prev.content,
                      demos: {
                        ...prev.content.demos,
                        sectionTitle: next,
                      },
                    },
                  }))
                  addLogEntry('Edited demo section title')
                }}
              />
              <EditableText
                as="p"
                value={content.demos.sectionSubtitle}
                className="text-lg text-text-secondary"
                multiline
                onCommit={(next) => {
                  setDraft((prev) => ({
                    ...prev,
                    content: {
                      ...prev.content,
                      demos: {
                        ...prev.content.demos,
                        sectionSubtitle: next,
                      },
                    },
                  }))
                  addLogEntry('Edited demo section subtitle')
                }}
              />
            </div>
            <DemoCardGrid />
          </section>
        ),
      },
      {
        id: 'cta',
        element: (
          <LiquidGlass as="section" variant="panel" className="p-12 text-center transition-transform duration-300">
            <h3 className="font-heading text-3xl text-white">Your Project Starts Here</h3>
            <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
              We design and build integrated systems that support real growth. Connect with us when you’re ready to
              operate at the next level.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild>
                <a href="/contact">{content.cta.primary}</a>
              </Button>
              <Button asChild variant="ghost">
                <a href="/resources">{content.cta.secondary}</a>
              </Button>
            </div>
          </LiquidGlass>
        ),
      },
    ],
    [addLogEntry, content.cta.primary, content.cta.secondary, content.demos.sectionSubtitle, content.demos.sectionTitle, setDraft],
  )

  const orderedSections = useMemo(() => {
    if (!layout.sectionsOrder?.length) return sections
    const byId = new Map(sections.map((section) => [section.id, section]))
    const ordered = layout.sectionsOrder.map((id) => byId.get(id)).filter(Boolean)
    const missing = sections.filter((section) => !layout.sectionsOrder.includes(section.id))
    return [...(ordered as typeof sections), ...missing]
  }, [layout.sectionsOrder, sections])

  const commitSectionOrder = (nextOrder: string[]) => {
    setLayout({ sectionsOrder: nextOrder })
    setDraft((prev) => ({
      ...prev,
      layout: {
        ...prev.layout,
        sectionsOrder: nextOrder,
      },
    }))
    addLogEntry('Reordered sections')
  }

  return (
    <div className={cn(spacingClass)}>
      <LiquidGlass
        as="section"
        variant="hero"
        className={cn(
          'relative flex flex-col justify-center overflow-hidden px-8 py-16',
          heroVariant.minHeight,
          heroVariant.container,
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,169,255,0.25),_transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 mb-6 flex w-full justify-center px-4 sm:px-8"
        >
          <span className="relative block h-32 w-full max-w-[20rem] sm:h-36 sm:max-w-[26rem] md:h-44 md:w-[44rem] md:max-w-none">
            <Image src="/dndlogo2.png" alt="DnD Solutions logo" fill className="object-contain" priority />
          </span>
        </motion.div>

        <EditableText
          as={motion.h1}
          value={content.hero.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={cn('relative z-10 font-heading text-4xl leading-tight text-white', heroVariant.headline)}
          onCommit={(next) => {
            setDraft((prev) => ({
              ...prev,
              content: {
                ...prev.content,
                hero: {
                  ...prev.content.hero,
                  title: next,
                },
              },
            }))
            addLogEntry('Edited hero headline')
          }}
        />
        <EditableText
          as={motion.p}
          value={content.hero.subtitle}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className={cn(
            'relative z-10 mt-6 text-text-secondary',
            heroVariant.subhead,
            heroVariant.copyWidth,
            heroVariant.copyAlign,
          )}
          multiline
          onCommit={(next) => {
            setDraft((prev) => ({
              ...prev,
              content: {
                ...prev.content,
                hero: {
                  ...prev.content.hero,
                  subtitle: next,
                },
              },
            }))
            addLogEntry('Edited hero subhead')
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={cn(
            'relative z-10 mt-10 flex w-full flex-col items-center gap-4 sm:flex-row',
            heroVariant.cta,
          )}
        >
          <Button asChild className="w-full sm:w-auto">
            <a href="/contact">{content.hero.ctaPrimary}</a>
          </Button>
          <Button asChild variant="ghost" className="w-full sm:w-auto">
            <a href="#demos">{content.hero.ctaSecondary}</a>
          </Button>
        </motion.div>
      </LiquidGlass>

      {orderedSections.map((section) => (
        <div
          key={section.id}
          className={cn(
            'relative transition',
            reorderSections && 'rounded-3xl border border-dashed border-white/10 p-2',
            overSection === section.id && reorderSections && 'border-[var(--demo-accent-primary)]',
          )}
          onDragOver={(event) => {
            if (!reorderSections || !draggedSection) return
            event.preventDefault()
            setOverSection(section.id)
          }}
          onDragLeave={() => {
            if (!reorderSections) return
            setOverSection(null)
          }}
          onDrop={(event) => {
            if (!reorderSections || !draggedSection) return
            event.preventDefault()
            if (draggedSection === section.id) return
            const currentOrder = orderedSections.map((item) => item.id)
            const fromIndex = currentOrder.indexOf(draggedSection)
            const toIndex = currentOrder.indexOf(section.id)
            if (fromIndex === -1 || toIndex === -1) return
            commitSectionOrder(moveItem(currentOrder, fromIndex, toIndex))
            setDraggedSection(null)
            setOverSection(null)
          }}
        >
          {reorderSections && (
            <div className="pointer-events-none absolute right-5 top-5 z-10 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-text-muted">
              <span>Drag</span>
              <button
                type="button"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', section.id)
                  setDraggedSection(section.id)
                }}
                onDragEnd={() => {
                  setDraggedSection(null)
                  setOverSection(null)
                }}
                className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5"
              >
                <GripVertical className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className={cn(reorderSections && 'rounded-3xl')}>
            {section.element}
          </div>
        </div>
      ))}
    </div>
  )
}
