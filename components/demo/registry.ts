import type { DemoCardData, DemoId } from '@/lib/demo/demoData'
import { demoCards } from '@/lib/demo/demoData'
import EditModeDemo from '@/components/demo/demos/EditModeDemo'
import BackgroundLabDemo from '@/components/demo/demos/BackgroundLabDemo'
import FunnelLabDemo from '@/components/demo/demos/FunnelLabDemo'
import IndustrySwitcherDemo from '@/components/demo/demos/IndustrySwitcherDemo'

export type DemoShellLayout = 'side' | 'center' | 'wide'

export type DemoDefinition = {
  id: DemoId
  title: string
  subtitle: string
  layout?: DemoShellLayout
  card: DemoCardData
  Component: React.ComponentType
}

const cardById = new Map(demoCards.map((card) => [card.id, card]))

export const demoRegistry: DemoDefinition[] = [
  {
    id: 'edit-mode',
    title: 'Edit Mode Overlay',
    subtitle: 'Builder-grade controls to customize copy, layout, and ordering in place.',
    layout: 'side',
    card: cardById.get('edit-mode')!,
    Component: EditModeDemo,
  },
  {
    id: 'background-lab',
    title: 'Background Engine Lab',
    subtitle: 'Tune motion, noise, and palettes with live presets and telemetry.',
    layout: 'side',
    card: cardById.get('background-lab')!,
    Component: BackgroundLabDemo,
  },
  {
    id: 'funnel-lab',
    title: 'Live KPI Funnel Simulator',
    subtitle: 'Adjust traffic and conversion inputs to see revenue lift in real time.',
    layout: 'wide',
    card: cardById.get('funnel-lab')!,
    Component: FunnelLabDemo,
  },
  {
    id: 'industry-switcher',
    title: 'Industry Skin Switcher',
    subtitle: 'Instantly re-skin copy, accents, and iconography for key verticals.',
    layout: 'side',
    card: cardById.get('industry-switcher')!,
    Component: IndustrySwitcherDemo,
  },
]
