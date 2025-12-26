'use client'

import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Boxes,
  Building2,
  CloudCog,
  Cog,
  Filter,
  Flame,
  Fingerprint,
  HeartPulse,
  Layers,
  Lock,
  LineChart,
  Rocket,
  Shield,
  ShieldAlert,
  ShoppingCart,
  Store,
  Tag,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
} from 'lucide-react'
import type { DemoIconKey } from '@/lib/demo/demoData'
import { useDemoEffects } from '@/lib/demo/effects'

const defaultIcons: Record<DemoIconKey, LucideIcon> = {
  builder: Layers,
  engine: Sparkles,
  funnel: Filter,
  industry: Building2,
}

const financeIcons: Record<DemoIconKey, LucideIcon> = {
  builder: ShieldCheck,
  engine: TrendingUp,
  funnel: LineChart,
  industry: Building2,
}

const healthcareIcons: Record<DemoIconKey, LucideIcon> = {
  builder: Stethoscope,
  engine: Activity,
  funnel: HeartPulse,
  industry: Building2,
}

const manufacturingIcons: Record<DemoIconKey, LucideIcon> = {
  builder: Cog,
  engine: Boxes,
  funnel: Filter,
  industry: Building2,
}

const saasIcons: Record<DemoIconKey, LucideIcon> = {
  builder: Layers,
  engine: CloudCog,
  funnel: Rocket,
  industry: Building2,
}

const retailIcons: Record<DemoIconKey, LucideIcon> = {
  builder: Tag,
  engine: Flame,
  funnel: ShoppingCart,
  industry: Store,
}

const securityIcons: Record<DemoIconKey, LucideIcon> = {
  builder: ShieldAlert,
  engine: Fingerprint,
  funnel: Lock,
  industry: Shield,
}

const iconSets: Record<string, Record<DemoIconKey, LucideIcon>> = {
  default: defaultIcons,
  finance: financeIcons,
  healthcare: healthcareIcons,
  manufacturing: manufacturingIcons,
  saas: saasIcons,
  retail: retailIcons,
  security: securityIcons,
}

type IndustryIconProps = {
  iconKey: DemoIconKey
  className?: string
}

export default function IndustryIcon({ iconKey, className }: IndustryIconProps) {
  const industryId = useDemoEffects((state) => state.industryId)
  const accent = useDemoEffects((state) => state.accent)
  const iconSet = iconSets[industryId ?? 'default'] ?? defaultIcons
  const Icon = iconSet[iconKey] ?? Layers

  return <Icon className={className} style={{ color: accent.icon }} />
}
