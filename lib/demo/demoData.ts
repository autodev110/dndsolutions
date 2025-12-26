export type DemoId =
  | 'edit-mode'
  | 'background-lab'
  | 'funnel-lab'
  | 'industry-switcher'

export type DemoIconKey = 'builder' | 'engine' | 'funnel' | 'industry'

export type DemoCardData = {
  id: DemoId
  title: string
  subtitle: string
  badge: string
  tags: string[]
  iconKey: DemoIconKey
  isFlagship?: boolean
}

export const demoCards: DemoCardData[] = [
  {
    id: 'edit-mode',
    title: 'Live Admin Overlay',
    subtitle: 'Builder-mode controls with inline edits, layout variants, and drag-and-drop ordering.',
    badge: 'Flagship',
    tags: ['Edit Mode', 'Layout'],
    iconKey: 'builder',
    isFlagship: true,
  },
  {
    id: 'background-lab',
    title: 'Background Engine Lab',
    subtitle: 'Tune motion, noise, and palette presets that re-skin the live canvas.',
    badge: 'Control Lab',
    tags: ['Motion', 'Presets'],
    iconKey: 'engine',
  },
  {
    id: 'funnel-lab',
    title: 'Live KPI Funnel Simulator',
    subtitle: 'Adjust traffic, conversion, and AOV to see revenue lift in real time.',
    badge: 'Growth',
    tags: ['KPIs', 'Uplift'],
    iconKey: 'funnel',
  },
  {
    id: 'industry-switcher',
    title: 'Industry Skin Switcher',
    subtitle: 'Swap copy, accents, and icons across finance, healthcare, SaaS, retail, manufacturing, and security.',
    badge: 'Context',
    tags: ['Copy', 'Palette'],
    iconKey: 'industry',
  },
]
